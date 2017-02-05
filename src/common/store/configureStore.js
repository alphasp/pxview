import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import invariant from 'redux-immutable-state-invariant';
import devTools from 'remote-redux-devtools';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants'
import createActionBuffer from 'redux-action-buffer'
import { AsyncStorage } from 'react-native';
import rootReducer from '../reducers';
import jwt from '../middlewares/jwt';
import pixiv from '../helpers/ApiClient';
import { DONE_REFRESH_TOKEN } from '../actions/auth';

export default function configureStore() {
  let enhancer;
  if (__DEVELOPMENT__) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(
      autoRehydrate({ log: true }),
      applyMiddleware(invariant(), jwt, thunk, createActionBuffer(REHYDRATE)),   
      //applyMiddleware(jwt, thunk, createActionBuffer(REHYDRATE)), 
      //devTools(),
    )
  }
  else {
    enhancer = compose(
      autoRehydrate({ log: true }),
      applyMiddleware(jwt, thunk, createActionBuffer(REHYDRATE)), 
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
    whitelist: ['searchHistory', 'auth'],
    storage: AsyncStorage,
  }, () => {
    console.log('rehydration complete');
    const { auth } = store.getState();
    if (auth && auth.user && auth.user.accessToken) {
      pixiv.setAuthToken(auth.user.accessToken);
    }
  });
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}