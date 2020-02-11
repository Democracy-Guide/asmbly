const DefaultControl = require('../base-control')
const Responsable = require('../../utility/response')
const Encryption = require('../../utility/encrypt')
const util = require('../utility')

const fire = require('../../lib/firebase')

const db = fire.admin.firestore()

const processActsForList = (acts, req) => {
	return acts.filter((value, index, arr) => {
		return value === req.user.uid
	})
}
const processDoc = (doc, req) => {
	let data = doc.data()
	if (data.prohibited) {
		data.contention = `this content is prohibited, ${data.moderationReason}`
		data.speech = `this content is prohibited, ${data.moderationReason}`
	}
	data.lovers = processActsForList(data.lovers, req)
	data.haters = processActsForList(data.haters, req)
	data.reporters = processActsForList(data.reporters, req)
	data.funders = processActsForList(data.funders, req)
	return data
}

module.exports = class Control extends DefaultControl {
	constructor(_model) {
		super(_model)
		this.patchFeels = this.patchFeels.bind(this)
		this.patchModeration = this.patchModeration.bind(this)
		this.patchReport = this.patchReport.bind(this)
		this.patchReportClosure = this.patchReportClosure.bind(this)
		this.getChildren = this.getChildren.bind(this)
		this.getChildrenAfter = this.getChildrenAfter.bind(this)
		this.getPersonaList = this.getPersonaList.bind(this)
	}

	/**
	 * Response for requesting a list of data
	 * encrypted content is not decrypted for listing
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	getChildren(req, res) {
		const event = `BEMA-GET-CHILDREN`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		const guest = req.user.uid

		if (
			this.validPnyx(pnyx, req, { guest: guest }) &&
			this.model.canRead(req.role)
		) {
			let results = []
			return this.model
				.listPinnedChildren(false, req.params.key, pnyx)
				.then(async snap => {
					snap.forEach(doc => {
						results.push(processDoc(doc, req))
					})
					console.log('listing children', req.params.key, pnyx)
					return this.model.listChildren('', req.params.key, pnyx)
				})
				.then(unpinned => {
					unpinned.forEach(doc => {
						results.push(processDoc(doc, req))
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
	 * Response for requesting a list of data after a given key
	 * encrypted content is not decrypted for listing
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	getChildrenAfter(req, res) {
		const event = `BEMA-GET-CHILDREN-AFTER`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			let results = []
			return this.model
				.listPinned('', pnyx)
				.then(snap => {
					snap.forEach(doc => {
						results.push(processDoc(doc, req))
					})

					return this.model.list('', pnyx)
				})
				.then(unpinned => {
					unpinned.forEach(doc => {
						results.push(processDoc(doc, req))
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
	 * Response for requesting a list of data
	 * encrypted content is not decrypted for listing
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	async getPersonaList(req, res) {
		const event = `BEMA-GET-PERSONA-LIST`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyxIn = req.params.pnyx ? req.params.pnyx : false

		const comp = pnyxIn.split('-')

		const guest = req.user.uid

		const hostPersonaQuery = await util.findPersonaByName(comp[1])

		const hostPersona = hostPersonaQuery.docs[0].data()

		const pnyx = `${comp[0]}-${hostPersona.UID}`

		if (
			this.validPnyx(pnyx, req, { guest: guest }) &&
			this.model.canRead(req.role)
		) {
			let results = []
			if (hostPersona.UID === guest) {
				console.log('hosted', hostPersona.UID, pnyx)
				return this.model
					.listPinnedHosted('', hostPersona.UID, pnyx)
					.then(async snap => {
						snap.forEach(doc => {
							results.push(processDoc(doc, req))
						})

						return this.model.listHosted('', hostPersona.UID, pnyx)
					})
					.then(unpinned => {
						unpinned.forEach(doc => {
							results.push(processDoc(doc, req))
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
				console.log('guested', hostPersona.UID, guest, pnyx)
				return this.model
					.listPinnedGuested('', hostPersona.UID, guest, pnyx)
					.then(async snap => {
						snap.forEach(doc => {
							results.push(processDoc(doc, req))
						})

						return this.model.listGuested(
							'',
							hostPersona.UID,
							guest,
							pnyx
						)
					})
					.then(unpinned => {
						unpinned.forEach(doc => {
							results.push(processDoc(doc, req))
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
			}
		}

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			let results = []
			return this.model
				.listPinned('', pnyx)
				.then(async snap => {
					snap.forEach(doc => {
						results.push(processDoc(doc, req))
					})

					return this.model.list('', pnyx)
				})
				.then(unpinned => {
					unpinned.forEach(doc => {
						results.push(processDoc(doc, req))
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
	 * Response for requesting a list of data after a given key
	 * encrypted content is not decrypted for listing
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	getPersonaListAfter(req, res) {
		const event = `BEMA-GET-PERSONA-LIST-AFTER`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			let results = []
			return this.model
				.listPinned('', pnyx)
				.then(snap => {
					snap.forEach(doc => {
						results.push(processDoc(doc, req))
					})

					return this.model.list('', pnyx)
				})
				.then(unpinned => {
					unpinned.forEach(doc => {
						results.push(processDoc(doc, req))
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
	 * Response for requesting a list of data
	 * encrypted content is not decrypted for listing
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	getList(req, res) {
		const event = `BEMA-GET-LIST`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			let results = []
			return this.model
				.listPinned('', pnyx)
				.then(async snap => {
					snap.forEach(doc => {
						results.push(processDoc(doc, req))
					})

					return this.model.list('', pnyx)
				})
				.then(unpinned => {
					unpinned.forEach(doc => {
						results.push(processDoc(doc, req))
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
	 * Response for requesting a list of data after a given key
	 * encrypted content is not decrypted for listing
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	getListAfter(req, res) {
		const event = `BEMA-GET-LIST-AFTER`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			let results = []
			return this.model
				.listPinned('', pnyx)
				.then(snap => {
					snap.forEach(doc => {
						results.push(processDoc(doc, req))
					})

					return this.model.list('', pnyx)
				})
				.then(unpinned => {
					unpinned.forEach(doc => {
						results.push(processDoc(doc, req))
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
	 * Response for requesting a single data item by key
	 * encrypted content is decrypted for individual item requests
	 * internal method
	 * @param {request} req the incoming API request
	 * @param {response} res the outgoing response
	 * @returns {response} the output of the method requested if valid, an error response if not
	 */
	get(req, res) {
		const event = `BEMA-GET`

		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canRead(req.role)) {
			return this.model
				.get(req.params.key, pnyx)
				.then(doc => processDoc(doc, req))
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
	async post(req, res) {
		const event = `BEMA-POST`
		const email = req.user.email ? req.user.email : 'unknown'
		const bema = req.body

		let pnyxIn = req.params.pnyx ? req.params.pnyx : false
		let splitPnyx = pnyxIn.split('-')
		let recipient = false

		console.log('split persona', splitPnyx)

		let pnyx = pnyxIn

		console.log('posting pnyx', splitPnyx[0], splitPnyx[0] === 'persona')

		if (splitPnyx[0] === 'persona') {
			let recipient = splitPnyx[1] === 'me' ? req.persona : false

			if (!recipient) {
				let host = splitPnyx[1]
				if (splitPnyx[1] !== req.user.uid) {
					console.log('seeking persona', splitPnyx[1])
					const query = await util.findPersonaByName(splitPnyx[1])
					if (!query.empty) {
						recipient = query.docs[0]
						host = recipient.data().UID
					}
				}

				const guest = req.user.uid
				pnyx = `${splitPnyx[0]}-${host}`
				bema.host = host
				bema.guest = guest
			} else {
				const host = recipient.UID
				const guest = host
				pnyx = `${splitPnyx[0]}-${host}`
				bema.host = host
				bema.guest = guest
			}

			bema.pnyx = pnyx

			console.log('pnyxOut', pnyx)
		}

		if (this.validPnyx(pnyx, req, bema) && this.model.canWrite(req.role)) {
			return Encryption.encrypt(this.model, bema)
				.then(encrypted => {
					return this.model.set(encrypted, pnyx)
				})
				.then(async result => {
					const scored = await util.participate(req.user.uid, 5)
					const faced = await util.faced(req.user.uid, bema)
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
					console.log(err.message)
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
				new Error(error),
				email,
				res
			)
		}
	}

	async patchModeration(req, res) {
		const event = `BEMA-PATCH-MODERATION`
		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false
		const moderation = JSON.parse(req.body)
		if (
			this.validPnyx(pnyx, req) &&
			this.model.canWrite(req.role) &&
			req.persona.moderator
		) {
			return this.model
				.get(req.params.key, pnyx)
				.then(doc => {
					const prior = doc.data()
					const update = {
						[req.params.action]: !prior[req.params.action],
						moderationReason: moderation.reason,
						reported: !prior[req.params.action]
							? 0
							: prior.reported,
					}
					return this.model.update(req.params.key, update, pnyx)
				})
				.then(bema => {
					return Responsable.send200(
						Responsable.DEFAULT,
						event,
						req.ip_address,
						bema,
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

	async patchFeels(req, res) {
		const event = `BEMA-PATCH-FEELS`
		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false

		if (this.validPnyx(pnyx, req) && this.model.canWrite(req.role)) {
			const reference = this.model.reference(req.params.key, pnyx)

			let participationPoints = 0

			try {
				await db.runTransaction(transaction => {
					return transaction.get(reference).then(doc => {
						const bema = doc.data()

						const alreadyLoved = bema.lovers.find(
							lover => lover === req.user.uid
						)

						const alreadyHated = bema.haters.find(
							hater => hater === req.user.uid
						)

						participationPoints = alreadyLoved
							? 0
							: alreadyHated
							? 0
							: 1

						switch (req.params.feeling) {
							case 'loved': {
								const oldScore = parseInt(bema.loved)

								let loved = oldScore + 1

								const lovers = bema.lovers.filter(
									(value, index, arr) => {
										return value !== req.user.uid
									}
								)

								let hated = parseInt(bema.hated)

								let haters = bema.haters

								if (alreadyLoved) {
									loved = oldScore - 1
								} else {
									lovers.push(req.user.uid)
									if (alreadyHated) {
										hated = hated - 1
									}
									haters = bema.haters.filter(
										(value, index, arr) => {
											return value !== req.user.uid
										}
									)
								}

								return transaction.update(reference, {
									hated: hated,
									haters: haters,
									loved: loved,
									lovers: lovers,
								})
							}
							default: {
								const oldScore = parseInt(bema.hated)

								let hated = oldScore + 1

								const haters = bema.haters.filter(
									(value, index, arr) => {
										return value !== req.user.uid
									}
								)

								let loved = parseInt(bema.loved)

								let lovers = bema.lovers

								if (alreadyHated) {
									hated = oldScore - 1
								} else {
									haters.push(req.user.uid)
									if (alreadyLoved) {
										loved = loved - 1
									}
									lovers = bema.lovers.filter(
										(value, index, arr) => {
											return value !== req.user.uid
										}
									)
								}

								return transaction.update(reference, {
									hated: hated,
									haters: haters,
									loved: loved,
									lovers: lovers,
								})
							}
						}
					})
				})
			} catch (err) {
				return Responsable.send400(
					Responsable.DEFAULT,
					event,
					req.ip_address,
					err,
					email,
					res
				)
			}

			let scored = { score: participationPoints }
			if (participationPoints > 0) {
				await util.participate(req.user.uid, participationPoints)
			}

			return Responsable.send200(
				Responsable.DEFAULT,
				event,
				req.ip_address,
				scored,
				email,
				res
			)
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

	async patchReport(req, res) {
		const event = `BEMA-PATCH-REPORT`
		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false
		const report = req.body

		let newReport = false

		try {
			if (report.reason) {
				newReport = await util.report(
					req.user,
					req.params.key,
					pnyx,
					report.reason
				)
			} else {
				const revoked = await util.revokeReport(
					req.user,
					req.params.key,
					pnyx
				)
				newReport = { UID: revoked }
			}
		} catch (err) {
			console.log('error handling report', err)
			return Responsable.send400(
				Responsable.DEFAULT,
				event,
				req.ip_address,
				err,
				email,
				res
			)
		}
		if (this.validPnyx(pnyx, req) && this.model.canWrite(req.role)) {
			const reference = this.model.reference(req.params.key, pnyx)

			try {
				await db.runTransaction(transaction => {
					return transaction.get(reference).then(doc => {
						const bema = doc.data()
						const alreadyReported = bema.reporters.find(
							reporter => reporter === req.user.uid
						)
						const oldScore = parseInt(bema.reported)

						let reported = oldScore + 1

						let reporters = bema.reporters
						let reports = bema.reports ? bema.reports : []

						if (alreadyReported) {
							reported = oldScore - 1
							reporters = reporters.filter(
								reporter => reporter !== req.user.uid
							)
							reports = reports.filter(
								reporting => reporting !== newReport.UID
							)
						} else {
							reporters.push(req.user.uid)
							reports.push(newReport.UID)
						}

						return transaction.update(reference, {
							reported: reported,
							reporters: reporters,
							reports: reports,
						})
					})
				})

				return Responsable.send200(
					Responsable.DEFAULT,
					event,
					req.ip_address,
					newReport,
					email,
					res
				)
			} catch (err) {
				console.log('error reporting', err)
				return Responsable.send400(
					Responsable.DEFAULT,
					event,
					req.ip_address,
					err,
					email,
					res
				)
			}
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

	async patchReportClosure(req, res) {
		const event = `BEMA-PATCH-REPORT-CLOSURE`
		const email = req.user.email ? req.user.email : 'unknown'

		const pnyx = req.params.pnyx ? req.params.pnyx : false
		const reportKey = req.params.reportKey

		if (
			this.validPnyx(pnyx, req) &&
			this.model.canWrite(req.role) &&
			req.persona.moderator
		) {
			const reference = this.model.reference(req.params.key, pnyx)
			try {
				await util.closeReport(
					req.user,
					req.params.key,
					pnyx,
					reportKey
				)
				await db.runTransaction(transaction => {
					return transaction.get(reference).then(doc => {
						const bema = doc.data()
						const oldScore = parseInt(bema.reported)

						let reported = oldScore > 0 ? oldScore - 1 : 0

						return transaction.update(reference, {
							reported: reported,
						})
					})
				})

				return Responsable.send200(
					Responsable.DEFAULT,
					event,
					req.ip_address,
					{ closed: true },
					email,
					res
				)
			} catch (err) {
				console.log('error reporting', err)
				return Responsable.send400(
					Responsable.DEFAULT,
					event,
					req.ip_address,
					err,
					email,
					res
				)
			}
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
