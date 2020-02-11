import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/functions'
import 'firebase/firestore'

import conf from './firebaseConf'

if (typeof window !== 'undefined') {
	firebase.initializeApp(conf)

	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
}

export default firebase
