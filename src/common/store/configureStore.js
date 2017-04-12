import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import invariant from 'redux-immutable-state-invariant';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants'
import createActionBuffer from 'redux-action-buffer'
import { AsyncStorage } from 'react-native';
import rootReducer from '../reducers';
import rootSaga from '../sagas'
// import jwt from '../middlewares/jwt';
import pixiv from '../helpers/ApiClient';
import { requestRefreshToken, REFRESH_TOKEN_DONE, REFRESH_TOKEN_SUCCESS } from '../actions/auth';

export default function configureStore() {
  let enhancer;
  const sagaMiddleware = createSagaMiddleware();
  if (__DEVELOPMENT__) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(
      autoRehydrate({ log: true }),
      applyMiddleware(invariant(), createActionBuffer(REHYDRATE), thunk, sagaMiddleware),   
      //applyMiddleware(jwt, thunk, createActionBuffer(REHYDRATE)), 
      //devTools(),
    )
  }
  else {
    enhancer = compose(
      autoRehydrate(),
      applyMiddleware(createActionBuffer(REHYDRATE), thunk, sagaMiddleware)
    )
  }
  const store = createStore(rootReducer, undefined, enhancer);
  sagaMiddleware.run(rootSaga);
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
    //const { auth } = store.getState();
    
    // requestRefreshToken(store.dispatch); 
    // if (auth && auth.user && auth.user.accessToken) {
    //   pixiv.setAuthToken(auth.user.accessToken);
    // }
  });
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}