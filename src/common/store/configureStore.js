import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import invariant from 'redux-immutable-state-invariant';
import { persistStore, autoRehydrate, createTransform } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';
import applyAppStateListener from 'redux-enhancer-react-native-appstate';
import { AsyncStorage } from 'react-native';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

export default function configureStore() {
  let enhancer;
  const sagaMiddleware = createSagaMiddleware();
  if (process.env.NODE_ENV !== 'production') {
    const composeEnhancers =
      // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(
      autoRehydrate({ log: true }),
      applyAppStateListener(),
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
      applyAppStateListener(),
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

  const myTransform = createTransform(
    (inboundState, key) => {
      if (key === 'entities') {
        const { entities, browsingHistory } = store.getState();
        const selectedUsersEntities = {};
        const selectedIllustsEntities = browsingHistory.items.reduce(
          (prev, id) => {
            // return { ...obj, [key]: value };
            prev[id] = entities.illusts[id];
            const userId = entities.illusts[id].user;
            selectedUsersEntities[userId] = entities.users[userId];
            return prev;
          },
          {},
        );
        return {
          illusts: selectedIllustsEntities,
          users: selectedUsersEntities,
        };
      }
      return inboundState;
    },
    outboundState => outboundState,
    { whitelist: ['entities'] },
  );

  persistStore(
    store,
    {
      whitelist: ['searchHistory', 'browsingHistory', 'entities', 'auth'],
      storage: AsyncStorage,
      transforms: [myTransform],
    },
    () => {
      console.log('rehydration complete');
    },
  );
  if (module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}
