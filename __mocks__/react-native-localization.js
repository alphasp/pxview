const lang = 'en';

class RNLocalization {
  constructor(props) {
    this.props = props;
    this.setLanguage(lang);
  }

  setLanguage(interfaceLanguage) {
    const bestLanguage = interfaceLanguage;
    this.language = bestLanguage;
    // Associate the language object to the this object
    if (this.props[bestLanguage]) {
      // console.log("There are strings for the language:"+language);
      const localizedStrings = this.props[this.language];
      Object.keys(localizedStrings).forEach(key => {
        // console.log("Checking property:"+key);
        if (localizedStrings[key]) {
          // console.log("Associating property:"+key);
          this[key] = localizedStrings[key];
        }
      });
    }
  }
}

export default RNLocalization;
