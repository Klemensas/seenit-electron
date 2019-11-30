import * as React from 'react';
import { Component } from 'react';
import { Switch } from '@blueprintjs/core';
import { Formik } from 'formik';

type Props = {};

export default class Setup extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <h3 className="bp3-heading">Setup your app</h3>
        <Formik initialValues={{ vlc: false, browser: false }} onSubmit={() => {}}>
          {({ values, setFieldValue }) => (
            <form>
              <Switch
                id="vlc-switch"
                label="Vlc"
                checked={values.vlc}
                onChange={() => setFieldValue('vlc', !values.vlc)}
              />
              <Switch
                id="browser-switch"
                label="Browser"
                checked={values.browser}
                onChange={() => setFieldValue('browser', !values.browser)}
              />
            </form>
          )}
        </Formik>
      </div>
    );
  }
}
