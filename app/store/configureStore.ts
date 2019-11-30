import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { forwardToRenderer, forwardToMain, replayActionMain, replayActionRenderer, getInitialStateRenderer  } from 'electron-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';

import { createHashHistory, History } from 'history';

import createRootReducer from '../reducers';

export default (isMain = false, initialState = getInitialStateRenderer()) => {
  let history: null | History = null
  let logger: Middleware[] = []
  let replay

  if (isMain) {
    replay = replayActionMain;
  } else {
    history = createHashHistory();
    replay = replayActionRenderer;

    if (process.env.NODE_ENV === 'development') {
      logger = [createLogger({
        level: 'info',
        collapsed: true
      })]
    }
  }

  const rootReducer = createRootReducer(history);
  const router = routerMiddleware(history);

  const middleware = [
    ...logger,
    thunk,
    router,
  ];
  isMain ? middleware.push(forwardToRenderer) : middleware.unshift(forwardToMain)

  let composeEnhancers = compose;
  if (!isMain && process.env.NODE_ENV === 'development') {
    composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'];
  }

  const enhancers = [
    applyMiddleware(...middleware),
  ];

  const enhancer = composeEnhancers(...enhancers) as any;
  const store = createStore(rootReducer, initialState, enhancer);

  if ((module as any).hot) {
    (module as any).hot.accept(
      '../reducers', // eslint-disable-next-line global-require
      () => store.replaceReducer(require('../reducers').default)
    );
  }

  replay(store);

  return {
    store, history,
  };
};

