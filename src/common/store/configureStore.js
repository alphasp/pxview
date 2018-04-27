import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import invariant from 'redux-immutable-state-invariant';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import getStoredStateMigrateV4 from 'redux-persist/lib/integration/getStoredStateMigrateV4';
import applyAppStateListener from 'redux-enhancer-react-native-appstate';
import { AsyncStorage } from 'react-native';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

const myTransform = createTransform(
  (inboundState, key, state) => {
    switch (key) {
      case 'entities': {
        const {
          entities,
          browsingHistoryIllusts,
          browsingHistoryNovels,
          muteUsers,
        } = state;
        const selectedUsersEntities = {};
        const selectedIllustsEntities = browsingHistoryIllusts.items
          .filter(id => entities.illusts[id])
          .reduce((prev, id) => {
            prev[id] = entities.illusts[id];
            const userId = entities.illusts[id].user;
            selectedUsersEntities[userId] = entities.users[userId];
            return prev;
          }, {});
        const selectedNovelsEntities = browsingHistoryNovels.items
          .filter(id => entities.novels[id])
          .reduce((prev, id) => {
            prev[id] = entities.novels[id];
            const userId = entities.novels[id].user;
            selectedUsersEntities[userId] = entities.users[userId];
            return prev;
          }, {});
        const selectedUsersEntities2 = muteUsers.items
          .filter(id => entities.users[id])
          .reduce((prev, id) => {
            prev[id] = entities.users[id];
            return prev;
          }, {});
        const finalSelectedUsersEntities = {
          ...selectedUsersEntities,
          ...selectedUsersEntities2,
        };
        return {
          ...inboundState,
          illusts: selectedIllustsEntities,
          novels: selectedNovelsEntities,
          users: finalSelectedUsersEntities,
        };
      }
      case 'browsingHistoryIllusts': {
        const { entities, browsingHistoryIllusts } = state;
        return {
          ...inboundState,
          items: browsingHistoryIllusts.items.filter(
            id =>
              entities.illusts[id] &&
              entities.illusts[id].user &&
              entities.users[entities.illusts[id].user],
          ),
        };
      }
      case 'browsingHistoryNovels': {
        const { entities, browsingHistoryNovels } = state;
        return {
          ...inboundState,
          items: browsingHistoryNovels.items.filter(
            id =>
              entities.novels[id] &&
              entities.novels[id].user &&
              entities.users[entities.novels[id].user],
          ),
        };
      }
      default:
        return inboundState;
    }
  },
  outboundState => outboundState,
  {
    whitelist: [
      'entities',
      'browsingHistoryIllusts',
      'browsingHistoryNovels',
      'muteUsers',
    ],
  },
);

const clearV4PersistedContents = () =>
  AsyncStorage.getAllKeys((err, keys) => {
    if (!err && keys && keys.length) {
      const keyPrefix = 'reduxPersist:';
      const v4PersistKeys = keys.filter(key => key.indexOf(keyPrefix) === 0);
      if (v4PersistKeys.length) {
        AsyncStorage.multiRemove(v4PersistKeys, () => Promise.resolve());
      }
      return Promise.resolve();
    }
    return Promise.resolve();
  });

export default function configureStore() {
  let enhancer;
  const sagaMiddleware = createSagaMiddleware();
  if (process.env.NODE_ENV !== 'production') {
    const composeEnhancers =
      // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(
      applyAppStateListener(),
      applyMiddleware(invariant(), sagaMiddleware),
      // devTools(),
    );
  } else {
    enhancer = compose(
      applyAppStateListener(),
      applyMiddleware(sagaMiddleware),
    );
  }

  const v4Config = {
    whitelist: [
      'searchHistory',
      'browsingHistoryIllusts',
      'browsingHistoryNovels',
      'highlightTags',
      'muteTags',
      'muteUsers',
      'saveImageSettings',
      'novelSettings',
      'entities',
      'auth',
      'i18n',
    ],
    storage: AsyncStorage,
    transforms: [myTransform],
  };

  const persistConfig = {
    key: 'root',
    stateReconciler: autoMergeLevel2,
    whitelist: [
      'searchHistory',
      'browsingHistoryIllusts',
      'browsingHistoryNovels',
      'highlightTags',
      'muteTags',
      'muteUsers',
      'saveImageSettings',
      'initialScreenSettings',
      'novelSettings',
      'entities',
      'auth',
      'i18n',
      'temptest',
    ],
    storage: AsyncStorage,
    transforms: [myTransform],
    getStoredState: getStoredStateMigrateV4(v4Config),
    debug: process.env.NODE_ENV !== 'production',
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(persistedReducer, undefined, enhancer);
  sagaMiddleware.run(rootSaga);

  const persistor = persistStore(store, undefined, clearV4PersistedContents);
  if (module.hot) {
    // eslint-disable-next-line global-require
    const nextRootReducer = require('../reducers');
    module.hot.accept(() => {
      store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
    });
  }

  return { store, persistor };
}
