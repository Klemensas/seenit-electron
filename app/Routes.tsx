import * as React from 'react';
import { Switch, Route, Redirect/* , useLocation  */} from 'react-router';

import { Routes } from './constants/routes';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import SetupPage from './containers/SetupPage';
import storage from './storage';

export default () => {
  //
  // const location = useLocation()
  const isConfigured = storage.get('isConfigured')

  return (
    <React.Fragment>
      <Switch>
        <Route path={Routes.Setup} component={SetupPage} />
        <Route path={Routes.Counter} component={CounterPage} />
        <Route path={Routes.Home} component={HomePage} />
      </Switch>
      {isConfigured && <Redirect to={Routes.Setup} />}
    </React.Fragment>
  );
}
