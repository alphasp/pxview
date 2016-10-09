import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import invariant from 'redux-immutable-state-invariant';
import devTools from 'remote-redux-devtools';
import rootReducer from '../reducers';

export default function configureNativeStore(history, data) {
  let finalCreateStore;
  if (__DEVELOPMENT__) {
    finalCreateStore = compose(
      applyMiddleware(invariant(), thunk), 
      devTools()
    )(createStore);
  }
  else {
    finalCreateStore = applyMiddleware(thunk)(createStore);
  }
  const store = finalCreateStore(rootReducer, data);
  // middleware.listenForReplays(store);
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }
  return store;
}