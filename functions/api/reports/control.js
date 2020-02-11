const DefaultControl = require('../base-control')
const Responsable = require('../../utility/response')
const Encryption = require('../../utility/encrypt')
const util = require('../utility')

module.exports = class Control extends DefaultControl {
	constructor(_model) {
		super(_model)
		this.getOpenList = this.getOpenList.bind(this)
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
		const event = `REPORTS-GET-LIST`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			let results = {}
			return this.model
				.list('', pnyx)
				.then(async snap => {
					snap.forEach(doc => {
						let report = doc.data()
						if (results[report.reportedBema]) {
							results[report.reportedBema].push(report)
						} else {
							results[report.reportedBema] = [report]
						}
					})

					const bemaReports = []

					const bemas = await util.findBemasByUID(
						Object.keys(results),
						pnyx
					)

					console.log('bemas found', bemas.empty)

					bemas.forEach(bemaData => {
						const bema = bemaData.data()
						bema.reportsFiled = results[bema.UID]
						bema.reported = 0
						bemaReports.push(bema)
					})

					return Responsable.send200(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						bemaReports,
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
		const event = `REPORTS-GET-LIST-AFTER`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			let results = []
			return this.model
				.list(req.params.after, pnyx)
				.then(snap => {
					snap.forEach(async doc => {
						let report = doc.data()
						report.bema = await util.findBemaByUID(
							report.reportedBema
						)
						results.push(report)
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

	getOpenList(req, res) {
		const event = `REPORTS-GET-OPEN-LIST`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			let results = {}
			return this.model
				.listOpen('', pnyx)
				.then(async snap => {
					if (snap.empty) {
						return Responsable.send200(
							Responsable.DEFAULT,
							event,
							req.ip_address,
							[],
							email,
							res
						)
					}
					snap.forEach(doc => {
						let report = doc.data()
						if (results[report.reportedBema]) {
							results[report.reportedBema].push(report)
						} else {
							results[report.reportedBema] = [report]
						}
					})

					const bemaReports = []

					const bemas = await util.findBemasByUID(
						Object.keys(results),
						pnyx
					)

					console.log('bemas found', bemas.empty)

					bemas.forEach(bemaData => {
						const bema = bemaData.data()
						bema.reportsFiled = results[bema.UID]
						bema.reported = 0
						bemaReports.push(bema)
					})

					return Responsable.send200(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						bemaReports,
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
