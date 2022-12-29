import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'
import 'firebase/storage'
import { environment } from '@/environments/environment'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: environment.apiKey, //'AIzaSyC60MVfHinclp1ApT-URgLBilO5y6Ymwc8',
  authDomain: environment.authDomain, //'madagascar-stage.firebaseapp.com',
  projectId: environment.projectId, //'madagascar-stage',
  storageBucket: environment.storageBucket, //'madagascar-stage.appspot.com',
  messagingSenderId: environment.messagingSenderId, //'900384012981',
  appId: environment.appId //'1:900384012981:web:0a5676b3b0347db15a1cfc'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// utils
// firebase.firestore().enablePersistence()
//   .catch((err) => {
//     if (err.code === 'failed-precondition') {
//       console.log(err)
//     } else if (err.code === 'unimplemented') {
//       console.log(err)
//     }
//   })
const db = firebase.firestore()
const incFB = firebase.firestore.FieldValue.increment
const newA = firebase.firestore.FieldValue.arrayUnion
const removeA = firebase.firestore.FieldValue.arrayRemove
const auth = firebase.auth()
const fb = firebase
const functions = firebase.functions()

// collection references
const accountsCollection = db.collection('accounts')
const notificationsCollection = db.collection('notifications')
const resourcesPermissionsCollection = db.collection('resourcesPermissions')

// export utils/refs
export {
  functions,
  fb,
  db,
  auth,
  accountsCollection,
  notificationsCollection,
  resourcesPermissionsCollection,
  incFB,
  newA,
  removeA
}