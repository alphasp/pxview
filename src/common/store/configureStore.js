import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import invariant from 'redux-immutable-state-invariant';
import devTools from 'remote-redux-devtools';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import rootReducer from '../reducers';

export default function configureStore() {
  let enhancer;
  if (__DEVELOPMENT__) {
    enhancer = compose(
      applyMiddleware(invariant(), thunk), 
      autoRehydrate({ log: true }),
      devTools(),
    )
  }
  else {
    enhancer = compose(
      applyMiddleware(invariant(), thunk), 
      autoRehydrate({ log: true }),
    )
  }
  const store = createStore(rootReducer, undefined, enhancer);
  // middleware.listenForReplays(store);

  // const middleware = compose(
  //   applyMiddleware(invariant(), thunk),
  //   autoRehydrate({ log:true }),
  //   devTools(),
  // );

  //const store = createStore(rootReducer, undefined, middleware);

  persistStore(store, { 
    whitelist: ['searchHistory'],
    storage: AsyncStorage,
  }, () => {
    console.log('rehydration complete');
  });
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}