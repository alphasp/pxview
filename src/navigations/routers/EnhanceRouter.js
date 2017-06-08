/* eslint-disable react/prefer-stateless-function */
// https://github.com/react-community/react-navigation/issues/802#issuecomment-296728810

import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { NAV } from '../../common/constants/actionTypes';

const enhanceRouter = WrappedNavigator => {
  class Enhance extends Component {
    render() {
      return <WrappedNavigator {...this.props} />;
    }
  }

  hoistNonReactStatic(Enhance, WrappedNavigator);

  Enhance.router = {
    ...WrappedNavigator.router,
    getStateForAction(action, state) {
      if (state && action.type === NAV.REPLACE) {
        const routes = state.routes.slice(0, state.routes.length - 1);
        routes.push(action);
        return {
          ...state,
          routes,
          index: routes.length - 1,
        };
      }
      return WrappedNavigator.router.getStateForAction(action, state);
    },
  };

  return Enhance;
};

export default enhanceRouter;
