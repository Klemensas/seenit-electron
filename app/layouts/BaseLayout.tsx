import * as React from 'react';

export default class BaseLayout extends React.Component {
  render() {
    const { children } = this.props;

    return <React.Fragment>{children}</React.Fragment>;
  }
}
