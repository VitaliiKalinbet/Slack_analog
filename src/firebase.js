import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

let config = {
    apiKey: "AIzaSyA65Tzuu7budjgA2PgI3dQEWroXcSymlyw",
    authDomain: "slackanalog.firebaseapp.com",
    databaseURL: "https://slackanalog.firebaseio.com",
    projectId: "slackanalog",
    storageBucket: "slackanalog.appspot.com",
    messagingSenderId: "762380159854"
  };
firebase.initializeApp(config);

export default firebase;