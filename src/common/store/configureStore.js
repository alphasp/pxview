import { createStore, applyMiddleware, compose } from 'redux';
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
        sagaMiddleware,
      ),
      // devTools(),
    );
  } else {
    enhancer = compose(
      autoRehydrate(),
      applyAppStateListener(),
      applyMiddleware(createActionBuffer(REHYDRATE), sagaMiddleware),
    );
  }
  const store = createStore(rootReducer, undefined, enhancer);
  sagaMiddleware.run(rootSaga);

  const myTransform = createTransform(
    (inboundState, key) => {
      switch (key) {
        case 'entities': {
          const {
            entities,
            browsingHistoryIllusts,
            browsingHistoryNovels,
            muteUsers,
          } = store.getState();
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
          const { entities, browsingHistoryIllusts } = store.getState();
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
          const { entities, browsingHistoryNovels } = store.getState();
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

  persistStore(store, {
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
  });
  if (module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}
