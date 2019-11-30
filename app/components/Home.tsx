import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

import { Routes } from '../constants/routes';
const styles = require('./Home.css');

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Link to={Routes.Counter}>to Counter</Link>
        <Link to={Routes.Setup}>to Setup</Link>
      </div>
    );
  }
}
