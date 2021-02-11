import { asyncPkceChallenge } from 'react-native-pkce-challenge';

class PKCE {
  static getPKCE = () => {
    if (this.pkce) {
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
    return this.pkce;
  }
}

export default PKCE;
