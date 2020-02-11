const validator = require('validator')
const DefaultModel = require('../base-model')

const security = { key: 'public', permission: 'pnyx-content' }

const collection = 'reports'
const orderBy = 'UID'
const unique = 'reportKey'
const default_model = {
	reportKey: {
		required: true,
		default: '',
	},
	reportedBema: {
		required: true,
		default: '',
	},
	reportedBy: {
		required: true,
		default: '',
	},
	reportedFor: {
		required: true,
		default: '',
	},
	reportedOn: {
		required: true,
		default: new Date().getTime(),
	},
	reviewed: {
		required: false,
		default: false,
	},
	closed: {
		required: false,
		default: false,
	},
}

module.exports = class Model extends DefaultModel {
	constructor() {
		super(collection, orderBy, unique, security, default_model)
	}

	/**
	 * Retrieves a data query snapshot for the API
	 * supports get functionality
	 * @param {string} [input=''] startAt an optional data key to start listing at
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<QuerySnapshot>} the resulting query snapshot
	 */
	listOpen(startAt = false, pnyx = false) {
		return new Promise((resolve, reject) => {
			let ref = this.collectionRef(pnyx)
				.where('closed', '==', false)
				.orderBy(this.orderBy)
				.limit(25)

			if (startAt) {
				ref = ref.startAfter(startAt)
			}

			ref.get()
				.then(querySnap => {
					return resolve(querySnap)
				})
				.catch(err => {
					return reject(err)
				})
		})
	}
}
