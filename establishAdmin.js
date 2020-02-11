const admin = require('firebase-admin')

const email = process.argv[2]

if (!email) {
	console.log('UID must be provided')
	process.exit(1)
}

const credentials = JSON.parse(process.env.FIREBASE_CONFIG)

const app = admin.initializeApp({
	credential: admin.credential.cert(credentials),
})

app.auth()
	.getUserByEmail(email)
	.then(function(userRecord) {
		return app.auth().setCustomUserClaims(userRecord.uid, {
			staff: true,
			administrator: true,
			role: 'administrator',
		})
	})
	.then(() => {
		console.log('admin claims set successfully')
		process.exit(0)
	})
	.catch(err => {
		console.log('admin claims failed to set', err.message)
		process.exit(1)
	})
