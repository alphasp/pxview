/* eslint-disable no-console */

// getStoredStateV4(v4Config) based from https://github.com/rt2zz/redux-persist/blob/master/src/integration/getStoredStateMigrateV4.js

import { getStoredState } from 'redux-persist';
import RNFetchBlob from 'react-native-fetch-blob';

const KEY_PREFIX = 'reduxPersist:';

function hasLocalStorage() {
  if (typeof window !== 'object' || !('localStorage' in window)) {
    return false;
  }

  try {
    const storage = window.localStorage;
    const testKey = `redux-persist localStorage test`;
    storage.setItem(testKey, 'test');
    storage.getItem(testKey);
    storage.removeItem(testKey);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production')
      console.warn(
        `redux-persist localStorage test failed, persistence will be disabled.`,
      );
    return false;
  }
  return true;
}

const noop = () => /* noop */ null;
const noStorage = {
  getItem: noop,
  setItem: noop,
  removeItem: noop,
  getAllKeys: noop,
};
const createAsyncLocalStorage = () => {
  if (!hasLocalStorage()) return noStorage;
  const localStorage = window.localStorage;
  return {
    getAllKeys(cb) {
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i += 1) {
          keys.push(localStorage.key(i));
        }
        cb(null, keys);
      } catch (e) {
        cb(e);
      }
    },
    getItem(key, cb) {
      try {
        const s = localStorage.getItem(key);
        cb(null, s);
      } catch (e) {
        cb(e);
      }
    },
    setItem(key, string, cb) {
      try {
        localStorage.setItem(key, string);
        cb(null);
      } catch (e) {
        cb(e);
      }
    },
    removeItem(key, cb) {
      try {
        localStorage.removeItem(key);
        cb && cb(null); // eslint-disable-line no-unused-expressions
      } catch (e) {
        cb(e);
      }
    },
  };
};

function getStoredStateV4(v4Config) {
  return new Promise((resolve, reject) => {
    let storage = v4Config.storage || createAsyncLocalStorage();
    const deserializer =
      v4Config.serialize === false
        ? data => data
        : (serial: string) => JSON.parse(serial);
    const blacklist = v4Config.blacklist || [];
    const whitelist = v4Config.whitelist || false;
    const transforms = v4Config.transforms || [];
    const keyPrefix =
      v4Config.keyPrefix !== undefined ? v4Config.keyPrefix : KEY_PREFIX;

    // fallback getAllKeys to `keys` if present (LocalForage compatability)
    if (storage.keys && !storage.getAllKeys)
      storage = { ...storage, getAllKeys: storage.keys };

    const restoredState = {};
    let completionCount = 0;

    function rehydrate(key: string, serialized: ?string) {
      let state = null;

      try {
        const data = serialized ? deserializer(serialized) : undefined;
        state = transforms.reduceRight(
          (subState, transformer) => transformer.out(subState, key),
          data,
        );
      } catch (err) {
        if (process.env.NODE_ENV !== 'production')
          console.warn(
            'redux-persist/getStoredState: Error restoring data for key:',
            key,
            err,
          );
      }

      return state;
    }

    function passWhitelistBlacklist(key) {
      if (whitelist && whitelist.indexOf(key) === -1) return false;
      if (blacklist.indexOf(key) !== -1) return false;
      return true;
    }

    function createStorageKey(key) {
      return `${keyPrefix}${key}`;
    }

    // eslint-disable-next-line consistent-return
    storage.getAllKeys((error, allKeys = []) => {
      if (error) {
        if (process.env.NODE_ENV !== 'production')
          console.warn(
            'redux-persist/getStoredState: Error in storage.getAllKeys',
          );
        return reject(error);
      }

      const persistKeys = allKeys
        .filter(key => key.indexOf(keyPrefix) === 0)
        .map(key => key.slice(keyPrefix.length));
      const keysToRestore = persistKeys.filter(passWhitelistBlacklist);

      const restoreCount = keysToRestore.length;
      if (restoreCount === 0) resolve(undefined);
      keysToRestore.forEach(key => {
        storage.getItem(createStorageKey(key), (err, serialized) => {
          if (err && process.env.NODE_ENV !== 'production')
            console.warn(
              'redux-persist/getStoredState: Error restoring data for key:',
              key,
              err,
            );
          else restoredState[key] = rehydrate(key, serialized);
          completionCount += 1;
          if (completionCount === restoreCount) resolve(restoredState);
        });
      });
    });
  });
}

export default function getStoredStateMigrateToFileSystemStorage(
  v5Config,
  v4Config,
) {
  return async currentConfig => {
    const filePersistStorePath = `${RNFetchBlob.fs.dirs
      .DocumentDir}/persistStore`;
    const isFilePersistStoreExists = await RNFetchBlob.fs.exists(
      filePersistStorePath,
    );
    if (isFilePersistStoreExists) {
      const state = await getStoredState(currentConfig);
      return state;
    }
    return getStoredState(v5Config).then(v5State => {
      if (v5State) {
        return v5State;
      }
      return getStoredStateV4(v4Config);
    });
  };
}
