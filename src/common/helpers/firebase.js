import firebase from 'firebase/app';
import 'firebase/database';
import config from '../config';

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  databaseURL: config.firebase.databaseURL,
  projectId: config.firebase.projectId,
};

firebase.initializeApp(firebaseConfig);

export default firebase;
