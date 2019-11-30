import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counter from './counter';
import { History } from 'history';

export default function createRootReducer(history: History | null) {
  const reducers = {
    counter,
  }
  if (history) {
    reducers['router'] = connectRouter(history)
  }

  return combineReducers(reducers);
}
