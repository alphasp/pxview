/* eslint-disable react/prefer-stateless-function */
// https://www.youtube.com/watch?v=-XULdsZWowU

import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { NAVIGATION } from '../../common/constants/actionTypes';

const EnhanceRouter = WrappedNavigator => {
  class Enhance extends Component {
    render() {
      return <WrappedNavigator {...this.props} />;
    }
  }

  hoistNonReactStatic(Enhance, WrappedNavigator);

  Enhance.router = {
    ...WrappedNavigator.router,
    getStateForAction(action, state) {
      if (state && action.type === NAVIGATION.REPLACE) {
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

export default EnhanceRouter;
