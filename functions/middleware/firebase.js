const admin = require('firebase-admin')

const Responsable = require('../utility/response')

const Api = require('../api/utility')

const EVENT_CLASS = 'FIREBASE-AUTHENTICATION'

module.exports = (req, res, next) => {
	const event = `${EVENT_CLASS}-MIDDLE`
	if (
		!req.headers.authorization ||
		!req.headers.authorization.startsWith('Bearer ')
	) {
		return Responsable.send403(
			Responsable.MIDDLE,
			event,
			req.ip_address,
			new Error(`invalid token: 001 @ ${req.headers['x-forwarded-url']}`),
			req.headers.authorization,
			res
		)
	}

	let idToken

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		idToken = req.headers.authorization.split('Bearer ')[1]
	}
	if (idToken) {
		return admin
			.auth()
			.verifyIdToken(idToken)
			.then(async decodedIdToken => {
				req.user = decodedIdToken
				let role = false
				let persona = false
				try {
					role = await Api.findRoleByUID(req.user.role)
					persona = await Api.findPersonaByUID(req.user.uid)
				} catch (err) {
					return Promise.reject(err)
				}

				return { persona: persona, role: role }
			})
			.then(auth => {
				req.role = auth.role
				req.user.roleType = auth.role.roleType
				req.pnyx = auth.persona.pnyx
				req.persona = auth.persona
				return next()
			})
			.catch(error => {
				console.log('middling', error.message)
				return Responsable.send401(
					Responsable.MIDDLE,
					event,
					req.ip_address,
					new Error(
						`invalid token: 002 @ ${req.headers['x-forwarded-url']}`
					),
					req.headers.authorization,
					res
				)
			})
	} else {
		return Responsable.send403(
			Responsable.MIDDLE,
			event,
			req.ip_address,
			new Error(`invalid token: 003 @ ${req.headers['x-forwarded-url']}`),
			req.headers.authorization,
			res
		)
	}
}
