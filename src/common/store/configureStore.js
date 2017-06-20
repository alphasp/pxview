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
import i18n from '../helpers/i18n';

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
      switch (key) {
        case 'entities': {
          const { entities, browsingHistory } = store.getState();
          const selectedUsersEntities = {};
          const selectedIllustsEntities = browsingHistory.items
            .filter(id => entities.illusts[id])
            .reduce((prev, id) => {
              prev[id] = entities.illusts[id];
              const userId = entities.illusts[id].user;
              selectedUsersEntities[userId] = entities.users[userId];
              return prev;
            }, {});
          return {
            ...inboundState,
            illusts: selectedIllustsEntities,
            users: selectedUsersEntities,
          };
        }
        case 'browsingHistory': {
          const { entities, browsingHistory } = store.getState();
          return {
            ...inboundState,
            items: browsingHistory.items.filter(id => entities.illusts[id]),
          };
        }
        default:
          return inboundState;
      }
    },
    outboundState => outboundState,
    { whitelist: ['entities', 'browsingHistory'] },
  );

  persistStore(
    store,
    {
      whitelist: [
        'searchHistory',
        'browsingHistory',
        'entities',
        'auth',
        'i18n',
      ],
      storage: AsyncStorage,
      transforms: [myTransform],
    },
    () => {
      const { lang } = store.getState().i18n;
      i18n.setLanguage(lang);
      console.log('rehydration complete');
    },
  );
  if (module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}
