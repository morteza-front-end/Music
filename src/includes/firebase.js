import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDeh5AyVaDZaGeAbj6YXwPYb2qEz-NUUCI',
  authDomain: 'music-ab0f6.firebaseapp.com',
  projectId: 'music-ab0f6',
  storageBucket: 'music-ab0f6.appspot.com',
  appId: '1:798771459894:web:a6c01f0674b7c9bd446597',
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
db.enablePersistence().catch((error) => {
  console.log(`error hapend ${error.code}`);
});

const userColection = db.collection('users');
const songsColection = db.collection('songs');
const commentsColection = db.collection('comments');

export {
  auth, db,
  userColection,
  songsColection,
  commentsColection,
  storage,
};
