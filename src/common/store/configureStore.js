import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import invariant from 'redux-immutable-state-invariant';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';
import { AsyncStorage } from 'react-native';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

export default function configureStore() {
  let enhancer;
  const sagaMiddleware = createSagaMiddleware();
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-underscore-dangle
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(
      autoRehydrate({ log: true }),
      applyMiddleware(
        invariant(),
        createActionBuffer(REHYDRATE),
        thunk,
        sagaMiddleware,
      ),
      //devTools(),
    );
  } else {
    enhancer = compose(
      autoRehydrate(),
      applyMiddleware(createActionBuffer(REHYDRATE), thunk, sagaMiddleware),
    );
  }
  const store = createStore(rootReducer, undefined, enhancer);
  sagaMiddleware.run(rootSaga);
  // middleware.listenForReplays(store);

  // const middleware = compose(
  //   applyMiddleware(invariant(), thunk),
  //   autoRehydrate({ log:true }),
  //   devTools(),
  // );

  // const store = createStore(rootReducer, undefined, middleware);

  persistStore(
    store,
    {
      whitelist: ['searchHistory', 'auth'],
      storage: AsyncStorage,
    },
    () => {
      console.log('rehydration complete');
      // const { auth } = store.getState();

      // requestRefreshToken(store.dispatch);
      // if (auth && auth.user && auth.user.accessToken) {
      //   pixiv.setAuthToken(auth.user.accessToken);
      // }
    },
  );
  if (module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}
