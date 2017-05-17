import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';

const connectLocalization = WrappedComponent => {
  class Localization extends Component {
    static contextTypes = {
      i18n: PropTypes.object.isRequired,
    };

    render() {
      const { i18n } = this.context;
      return <WrappedComponent {...this.props} i18n={i18n} />;
    }
  }

  hoistNonReactStatic(Localization, WrappedComponent);

  return Localization;
};
export default connectLocalization;
