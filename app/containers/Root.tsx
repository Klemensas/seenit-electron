import * as React from 'react';
import { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';

import Routes from '../Routes';
import BaseLayout from '../layouts/BaseLayout';

type Props = {
  store: any;
  history: History<any>;
};

export default class Root extends Component<Props> {
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <BaseLayout>
            <Routes />
          </BaseLayout>
        </ConnectedRouter>
      </Provider>
    );
  }
}
