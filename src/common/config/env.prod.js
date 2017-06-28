import { Platform } from 'react-native';

export default {
  firebase: {
    apiKey: 'AIzaSyBViHgCwYjD9F8fv7Acz3DTVX4vmW_-j9k',
    databaseURL: 'https://pixiv-9bc42.firebaseio.com',
    projectId: 'pixiv-9bc42',
  },
  navigation: {
    tab: Platform.OS === 'ios',
    // drawer: Platform.OS !== 'android'
  },
};
