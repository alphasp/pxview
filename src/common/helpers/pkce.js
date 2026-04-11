import AsyncStorage from '@react-native-community/async-storage';
import { asyncPkceChallenge } from 'react-native-pkce-challenge';

const PKCE_STORAGE_KEY = '@pxview/pkce';

class PKCE {
  static getPKCE = async () => {
    if (this.pkce) {
      return this.pkce;
    }

    const persistedPkce = await AsyncStorage.getItem(PKCE_STORAGE_KEY);
    if (persistedPkce) {
      this.pkce = JSON.parse(persistedPkce);
      return this.pkce;
    }

    return PKCE.generatePKCE();
  };

  static async generatePKCE() {
    const { codeChallenge, codeVerifier } = await asyncPkceChallenge();
    this.pkce = {
      codeChallenge,
      codeVerifier,
    };
    await AsyncStorage.setItem(PKCE_STORAGE_KEY, JSON.stringify(this.pkce));
    return this.pkce;
  }

  static async clearPKCE() {
    this.pkce = null;
    await AsyncStorage.removeItem(PKCE_STORAGE_KEY);
  }
}

export default PKCE;
