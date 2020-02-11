const config = require('../api/versioning')
const firebase = require('../lib/firebase')

exports.emailAuthPreference = firebase.functions.https.onCall(
	async (data, context) => {
		return firebase.admin
			.auth()
			.getUserByEmail(data.email)
			.then(userRecord => {
				emailKnown = true
				const db = firebase.admin.firestore()
				return db
					.collection(config.appCollection)
					.doc(config.appVersion)
					.collection('personas')
					.doc(userRecord.uid)
					.get()
			})
			.then(snap => snap.data())
			.then(persona => {
				if (persona.registrationCode !== 'expired') {
					return Promise.reject(new Error('Unauthorized'))
				}

				return { prefers: persona.authPref }
			})
			.catch(error => {
				throw new firebase.functions.https.HttpsError(
					'unknown',
					'something went wrong'
				)
			})
	}
)

exports.verifyRegistration = firebase.functions.https.onCall(
	async (data, context) => {
		let emailKnown = false
		return firebase.admin
			.auth()
			.getUserByEmail(data.email)
			.then(userRecord => {
				emailKnown = true
				const db = firebase.admin.firestore()
				return db
					.collection(config.appCollection)
					.doc(config.appVersion)
					.collection('personas')
					.doc(userRecord.uid)
					.get()
			})
			.then(snap => snap.data())
			.then(persona => {
				if (persona.registrationCode === 'expired') {
					return Promise.reject(new Error('Expired'))
				}
				if (persona.registrationCode === data.registrationCode) {
					return firebase.admin
						.auth()
						.createCustomToken(persona.UID, { role: persona.role })
				} else {
					return Promise.reject(new Error('Unauthorized'))
				}
			})
			.then(token => {
				return { authToken: token }
			})
			.catch(error => {
				if (error.message === 'Unauthorized') {
					throw new firebase.functions.https.HttpsError(
						'unauthenticated',
						'registration failed Unauthorized'
					)
				} else if (error.message === 'Expired') {
					throw new firebase.functions.https.HttpsError(
						'unauthenticated',
						'registration code is expired'
					)
				} else {
					throw new firebase.functions.https.HttpsError(
						'unknown',
						emailKnown
							? `registration failed ${error.message}`
							: 'bad registration'
					)
				}
			})
	}
)

exports.completeRegistration = firebase.functions.https.onCall(
	async (data, context) => {
		if (context.auth.token.role === 'participant') {
			return firebase.admin
				.auth()
				.updateUser(context.auth.uid, {
					displayName: data.personaName,
				})
				.then(userRecord => {
					const db = firebase.admin.firestore()
					return db
						.collection(config.appCollection)
						.doc(config.appVersion)
						.collection('personas')
						.doc(context.auth.uid)
						.update({
							registrationCode: 'expired',
							authPref: data.authPref,
						})
				})
				.then(() => {
					return { success: true }
				})

				.then(() => {
					return { success: true }
				})
		} else {
			throw new firebase.functions.https.HttpsError(
				'unknown',
				emailKnown
					? `registration failed ${error.message}`
					: 'bad registration'
			)
		}
	}
)

exports.validatePersonaName = firebase.functions.https.onCall(
	async (data, context) => {
		console.log(JSON.stringify(context.auth))
		if (context.auth.token.role === 'participant') {
			if (data.personaName.length < 5) {
				throw new firebase.functions.https.HttpsError(
					'invalid-argument',
					'persona name must be at least 5 characters'
				)
			}
			return firebase.admin
				.auth()
				.updateUser(context.auth.uid, {
					displayName: data.personaName,
					password: data.password,
				})
				.then(userRecord => {
					const db = firebase.admin.firestore()
					return db
						.collection(config.appCollection)
						.doc(config.appVersion)
						.collection('personas')
						.where('personaName', '==', data.personaName)
						.get()
				})
				.then(querySnapshot => querySnapshot.empty)
				.then(existing => {
					if (!existing) {
						throw new firebase.functions.https.HttpsError(
							'already-exists',
							`${data.personaName} has already been claimed`
						)
					} else {
						const db = firebase.admin.firestore()
						return db
							.collection(config.appCollection)
							.doc(config.appVersion)
							.collection('personas')
							.doc(context.auth.uid)
							.update({
								personaName: data.personaName,
							})
					}
				})
				.then(() => {
					return { success: true }
				})
		} else {
			throw new firebase.functions.https.HttpsError(
				'unauthenticated',
				'bad registration'
			)
		}
	}
)

exports.savePassword = firebase.functions.https.onCall(
	async (data, context) => {
		if (context.auth.token.role === 'participant') {
			return firebase.admin
				.auth()
				.updateUser(context.auth.uid, {
					displayName: data.personaName,
					password: data.password,
				})
				.then(userRecord => {
					const db = firebase.admin.firestore()
					return db
						.collection(config.appCollection)
						.doc(config.appVersion)
						.collection('personas')
						.doc(context.auth.uid)
						.update({
							registrationCode: 'expired',
							authPref: data.authPref,
						})
				})
				.then(() => {
					return { success: true }
				})
		} else {
			throw new firebase.functions.https.HttpsError(
				'unknown',
				emailKnown
					? `registration failed ${error.message}`
					: 'bad registration'
			)
		}
	}
)
