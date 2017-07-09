import AppNavigator from '../../navigations/AppNavigator';

function getCurrentRoute(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRoute(route);
  }
  return route;
}

export default function nav(state, action) {
  let nextState = AppNavigator.router.getStateForAction(action, state);
  nextState = {
    ...nextState,
    currentRoute: getCurrentRoute(nextState),
  };
  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}
