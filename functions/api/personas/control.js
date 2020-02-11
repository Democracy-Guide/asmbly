const Responsable = require('../../utility/response')
const Encryption = require('../../utility/encrypt')
const DefaultControl = require('../base-control')
const fire = require('../../lib/firebase')
/**
 * persona data control
 */
module.exports = class Control extends DefaultControl {
	constructor(_model) {
		super(_model)
		this.listUnassigned = this.listUnassigned.bind(this)
		this.postInvite = this.postInvite.bind(this)
		this.patchPromote = this.patchPromote.bind(this)
		this.patchDemote = this.patchDemote.bind(this)
		this.deleteInviteRequest = this.deleteInviteRequest.bind(this)
		this.getMessageList = this.getMessageList.bind(this)
	}

	/**
	 * Response for requesting a single data item by key
	 * encrypted content is decrypted for individual item requests
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	get(req, res) {
		const event = `PERSONA-GET`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (
			this.validPnyx(pnyx, req) &&
			this.model.canRead(req.role, req.params.key === req.user.uid)
		) {
			return this.model
				.get(req.params.key, pnyx)
				.then(doc => doc.data())
				.then(encResult => {
					return Encryption.decrypt(this.model, encResult)
				})
				.then(result => {
					return Responsable.send200(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						result,
						email,
						res
					)
				})
				.catch(err => {
					return Responsable.send400(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						err,
						email,
						res
					)
				})
		} else {
			const message = 'Unauthorized'
			return Responsable.send401(
				Responsable.DEFAULT,
				event,
				req.ip_address,
				new Error(message),
				email,
				res
			)
		}
	}

	/**
	 * Response for requesting a list of data
	 * encrypted content is not decrypted for listing
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	getMessageList(req, res) {
		const event = `PERSONA-GET-MESSAGE-LIST-${req.originalUrl}`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false
		console.log(
			'get message list',
			this.validPnyx(pnyx, req),
			this.model.canRead(req.role)
		)
		if (
			this.validPnyx(pnyx, req) &&
			this.model.canRead(req.role, req.params.key === req.user.uid)
		) {
			return this.model
				.reference(req.params.key)
				.collection('messages')
				.get()
				.then(snap => {
					let results = []
					snap.forEach(doc =>
						results.push(api.getPersonaBema(doc.data()))
					)
					return Promise.all(results)
				})
				.then(bemas => {
					let results = []
					bemas.forEach(bemaList => {
						results = results.concat(bemaList)
					})
					return Responsable.send200(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						results,
						email,
						res
					)
				})
				.catch(err => {
					return Responsable.send400(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						err,
						email,
						res
					)
				})
		} else {
			const message = 'Unauthorized'

			return Responsable.send401(
				Responsable.DEFAULT,
				event,
				req.ip_address,
				new Error(message),
				email,
				res
			)
		}
	}

	/**
	 * Response for posting an invite to an unassigned account
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	postInvite(req, res) {
		const event = `UNASSIGNED-POST-INVITE-${req.originalUrl}`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		const requested = req.body

		if (this.validPnyx(pnyx, req) && this.model.canWrite(req.role)) {
			return this.model
				.postInvite(requested.email)
				.then((success, error = false) => {
					if (success) {
						return Responsable.send200(
							Responsable.DEFAULT,
							event,
							req.ip_address,
							{ posted: true },
							email,
							res
						)
					} else {
						return Responsable.send400(
							Responsable.DEFAULT,
							event,
							req.ip_address,
							error,
							email,
							res
						)
					}
				})
		} else {
			const message = `Unauthorized to access postInvite`

			return Responsable.send401(
				Responsable.DEFAULT,
				event,
				req.ip_address,
				new Error(message),
				email,
				res
			)
		}
	}

	/**
	 * Response for deleting an unassigned invite request
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	deleteInviteRequest(req, res) {
		const event = `DEFAULT-DELETE-INVITE-REQUEST-${req.originalUrl}`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req.user) && this.model.canWrite(req.role)) {
			return this.model
				.removeInviteRequest(req.params.key)
				.then(result => {
					return Responsable.send200(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						result,
						email,
						res
					)
				})
				.catch(err => {
					return Responsable.send400(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						err,
						email,
						res
					)
				})
		} else {
			const message = 'Unauthorized'
			return Responsable.send401(
				Responsable.DEFAULT,
				event,
				req.ip_address,
				new Error(message),
				email,
				res
			)
		}
	}

	/**
	 * Response for requesting a list of unassigned pnyx prime invite requests
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	listUnassigned(req, res) {
		const event = `PERSONA-UNASSIGNED-GET-LIST`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			let results = []
			return this.model
				.listUnassigned()
				.then(listed => {
					return Responsable.send200(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						listed,
						email,
						res
					)
				})
				.catch(err => {
					return Responsable.send400(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						err,
						email,
						res
					)
				})
		} else {
			const message = `Unauthorized to access listUnassigned`

			return Responsable.send401(
				Responsable.DEFAULT,
				event,
				req.ip_address,
				new Error(message),
				email,
				res
			)
		}
	}

	patchPromote(req, res) {
		const event = `PERSONA-PATCH-PROMOTE`
		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canWrite(req.role)) {
			let toGo = {}
			return this.model
				.update(req.params.key, { moderator: true })
				.then(persona => {
					toGo = persona
					return fire.admin
						.auth()
						.setCustomUserClaims(req.params.key, {
							moderator: true,
							role: 'participant',
						})
				})
				.then(() => {
					return Responsable.send200(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						toGo,
						email,
						res
					)
				})
				.catch(err => {
					console.log(err)
					return Responsable.send400(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						err,
						email,
						res
					)
				})
		} else {
			const error = 'Unauthorized'
			return Responsable.send401(
				Responsable.DEFAULT,
				event,
				req.ip_address,
				new Error(message),
				email,
				res
			)
		}
	}
	patchDemote(req, res) {
		const event = `PERSONA-PATCH-DEMOTE`
		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canWrite(req.role)) {
			let toGo = {}
			return this.model
				.update(req.params.key, { moderator: false })
				.then(persona => {
					toGo = persona
					return fire.admin
						.auth()
						.setCustomUserClaims(req.params.key, {
							moderator: false,
							role: 'participant',
						})
				})
				.then(() => {
					return Responsable.send200(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						toGo,
						email,
						res
					)
				})
				.catch(err => {
					return Responsable.send400(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						err,
						email,
						res
					)
				})
		} else {
			const error = 'Unauthorized'
			return Responsable.send401(
				Responsable.DEFAULT,
				event,
				req.ip_address,
				new Error(message),
				email,
				res
			)
		}
	}
}
