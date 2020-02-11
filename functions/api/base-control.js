const Responsable = require('../utility/response')
const Encryption = require('../utility/encrypt')

const pnyxCats = { PNYX: 'pnyx', PERSONA: 'persona' }
/**
 * A generic ASMBLY data control
 */
class DefaultControl {
	/**
	 * Establishes data model
	 * @param {object} _model generally defined by the default model associated with the control
	 */
	constructor(_model) {
		this.model = _model
		this.canUserAccessPnyx = this.canUserAccessPnyx.bind(this)
		this.getList = this.getList.bind(this)
		this.getListAfter = this.getListAfter.bind(this)
		this.get = this.get.bind(this)
		this.post = this.post.bind(this)
		this.delete = this.delete.bind(this)
		this.processPnyxRequest = this.processPnyxRequest.bind(this)
	}

	/**
	 * Pnyx access validation
	 * static method
	 * we allow:
	 * administrator full access
	 * if request is for pnyx managed content,
	 * pnyx will not be false
	 * in such instances we only require the user to have
	 * a claim to the relevant pnyx
	 * @param {boolean} [input=false] pnyx pnyx referenced in request
	 * @param {Persona} requester the requesters persona identity
	 * @returns {boolean} if access is valid or not.
	 */
	validPnyx(pnyx = false, requester, bema = false) {
		console.log('validating pnyx', pnyx)
		if (!pnyx) {
			return true
		}
		let pnyxMap = []
		if (pnyx) {
			pnyxMap = pnyx.split('-')
		}
		const pnyxCat = pnyxMap.length > 0 ? pnyxMap[0] : ''
		switch (pnyxCat) {
			case pnyxCats.PNYX: {
				console.log('valid pnyx bema', pnyx, pnyxMap[1])
				return (
					requester.user.roleType === 'staff' ||
					requester.pnyx.indexOf(pnyx) > -1
				)
			}
			case pnyxCats.PERSONA: {
				if (!bema) {
					return false
				}
				return (
					requester.user.roleType === 'staff' ||
					pnyxMap[1] === requester.user.uid ||
					bema.guest === requester.user.uid
				)
			}
			default: {
				return false
			}
		}
	}

	/**
	 * Pnyx access validation utility
	 * internal method
	 * @param {request} the incoming API request
	 * @returns {boolean} if access is valid or not.
	 */
	canUserAccessPnyx(req) {
		return this.validPnyx(req.params.pnyx ? req.params.pnyx : false, req)
	}

	/**
	 * Pnyx access request
	 * allows standard validation of custom extensions of the control
	 * internal method
	 * @param {string} event a tag for logging what is being requested
	 * @param {function} method the method being requested
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	processPnyxRequest(event, method, req, res) {
		const email = req.user.email ? req.user.email : 'unknown'

		method = method.bind(this)

		if (this.canUserAccessPnyx(req)) {
			return method(req, res)
		} else {
			const error = 'Unauthorized'
			const message = `${event} ${error} ${req.params.key}`

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
	getList(req, res) {
		const event = `DEFAULT-GET-LIST-${req.originalUrl}`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			let results = []
			return this.model
				.list('', pnyx)
				.then(snap => {
					snap.forEach(doc => results.push(doc.data()))

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
	 * Response for requesting a list of data after a given key
	 * encrypted content is not decrypted for listing
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	getListAfter(req, res) {
		const event = `DEFAULT-GET-LIST-AFTER-${req.originalUrl}`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			let results = []
			return this.model
				.list(req.params.after, pnyx)
				.then(snap => {
					snap.forEach(doc => results.push(doc.data()))

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
	 * Response for requesting a single data item by key
	 * encrypted content is decrypted for individual item requests
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	get(req, res) {
		const event = `DEFAULT-GET-${req.originalUrl}`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
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
	 * Response for posting a single data item
	 * encrypted content is not encrypted when arriving
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	post(req, res) {
		const event = `DEFAULT-POST-${req.originalUrl}`
		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canWrite(req.role)) {
			var item = req.body
			return Encryption.encrypt(this.model, item)
				.then(encrypted => {
					return this.model.set(encrypted, pnyx)
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

	/**
	 * Response for putting a single data item
	 * encrypted content is not encrypted when arriving
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	put(req, res) {
		const event = `DEFAULT-PUT-${req.originalUrl}`
		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canWrite(req.role)) {
			var item = req.body
			return Encryption.encrypt(this.model, item)
				.then(encrypted => {
					return this.model.update(req.params.key, encrypted, pnyx)
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

	/**
	 * Response for deliting a single data item by key
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	delete(req, res) {
		const event = `DEFAULT-DELETE-${req.originalUrl}`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canWrite(req.role)) {
			return this.model
				.delete(req.params.key, pnyx)
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
}

module.exports = DefaultControl
