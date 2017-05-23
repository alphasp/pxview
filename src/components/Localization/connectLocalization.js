import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { connect } from 'react-redux';

const connectLocalization = WrappedComponent => {
  class Localization extends Component {
    static contextTypes = {
      i18n: PropTypes.object.isRequired,
    };

    render() {
      const { innerRef } = this.props;
      const { i18n } = this.context;
      return <WrappedComponent {...this.props} i18n={i18n} ref={innerRef} />;
    }
  }

  hoistNonReactStatic(Localization, WrappedComponent);

  return connect(state => ({
    lang: state.i18n.lang,
  }))(Localization);
};
export default connectLocalization;
