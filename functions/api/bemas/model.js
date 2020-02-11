const validator = require('validator')
const DefaultModel = require('../base-model')

const security = { key: 'public', permission: 'pnyx-content' }

const collection = 'bema'
const orderBy = 'sorty'
const unique = 'stamp'
const default_model = {
	pnyx: {
		required: true,
		default: '',
	},
	stamp: {
		required: true,
		default: '',
	},
	postedBy: {
		required: true,
		default: '',
	},
	postedByUID: {
		required: true,
		default: '',
	},
	postedTime: {
		required: true,
		default: '',
	},
	sorty: {
		required: true,
		default: '',
	},
	contention: {
		required: true,
		default: '',
	},
	speech: {
		required: true,
		default: '',
	},
	face: {
		required: true,
		default: '1F937',
	},
	skin: {
		required: false,
		default: '',
	},
	pinned: {
		required: true,
		default: false,
	},
	locked: {
		required: true,
		default: false,
	},
	hidden: {
		required: true,
		default: false,
	},
	prohibited: {
		required: true,
		default: false,
	},
	funded: {
		required: true,
		default: 0,
	},
	funders: {
		required: false,
		default: [],
	},
	loved: {
		required: true,
		default: 0,
	},
	lovers: {
		required: false,
		default: [],
	},
	reported: {
		required: true,
		default: 0,
	},
	reporters: {
		required: false,
		default: [],
	},
	reports: {
		required: false,
		default: [],
	},
	hated: {
		required: true,
		default: 0,
	},
	haters: {
		required: false,
		default: [],
	},
	moderationReason: {
		required: false,
		default: '',
	},
	autoModeration: {
		required: false,
		default: '',
	},
	parent: {
		required: false,
		default: '',
	},
	ancestor: {
		required: false,
		default: '',
	},
	children: {
		required: false,
		default: 0,
	},
	descendants: {
		required: false,
		default: 0,
	},
	host: {
		required: false,
		default: false,
	},
	guest: {
		required: false,
		default: false,
	},
}

module.exports = class Model extends DefaultModel {
	constructor() {
		super(collection, orderBy, unique, security, default_model)
		this.listPinned = this.listPinned.bind(this)
		this.listPinnedChildren = this.listPinnedChildren.bind(this)
		this.listChildren = this.listChildren.bind(this)
		this.listPinnedHosted = this.listPinnedHosted.bind(this)
		this.listHosted = this.listHosted.bind(this)
		this.listPinnedGuested = this.listPinnedGuested.bind(this)
		this.listGuested = this.listGuested.bind(this)
	}

	/**
	 * Retrieves a data query snapshot for the API
	 * supports get functionality
	 * @param {string} [input=''] startAt an optional data key to start listing at
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<QuerySnapshot>} the resulting query snapshot
	 */
	listPinnedGuested(startAt = false, host, guest, pnyx = false) {
		return new Promise((resolve, reject) => {
			let ref = this.collectionRef(pnyx)
				.where('pinned', '==', true)
				.where('host', '==', host)
				.where('guest', '==', guest)
				.where('parent', '==', '')
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
	/**
	 * Retrieves a data query snapshot for the API
	 * supports get functionality
	 * @param {string} [input=''] startAt an optional data key to start listing at
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<QuerySnapshot>} the resulting query snapshot
	 */
	listGuested(startAt = false, host, guest, pnyx = false) {
		return new Promise((resolve, reject) => {
			let ref = this.collectionRef(pnyx)
				.where('pinned', '==', false)
				.where('host', '==', host)
				.where('guest', '==', guest)
				.where('parent', '==', '')
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

	/**
	 * Retrieves a data query snapshot for the API
	 * supports get functionality
	 * @param {string} [input=''] startAt an optional data key to start listing at
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<QuerySnapshot>} the resulting query snapshot
	 */
	listPinnedHosted(startAt = false, host, pnyx = false) {
		return new Promise((resolve, reject) => {
			let ref = this.collectionRef(pnyx)
				.where('pinned', '==', true)
				.where('host', '==', host)
				.where('parent', '==', '')
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
	/**
	 * Retrieves a data query snapshot for the API
	 * supports get functionality
	 * @param {string} [input=''] startAt an optional data key to start listing at
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<QuerySnapshot>} the resulting query snapshot
	 */
	listHosted(startAt = false, host, pnyx = false) {
		return new Promise((resolve, reject) => {
			let ref = this.collectionRef(pnyx)
				.where('pinned', '==', false)
				.where('host', '==', host)
				.where('parent', '==', '')
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

	/**
	 * Retrieves a data query snapshot for the API
	 * supports get functionality
	 * @param {string} [input=''] startAt an optional data key to start listing at
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<QuerySnapshot>} the resulting query snapshot
	 */
	listPinnedChildren(startAt = false, parent, pnyx = false) {
		return new Promise((resolve, reject) => {
			let ref = this.collectionRef(pnyx)
				.where('pinned', '==', true)
				.where('parent', '==', parent)
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
	/**
	 * Retrieves a data query snapshot for the API
	 * supports get functionality
	 * @param {string} [input=''] startAt an optional data key to start listing at
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<QuerySnapshot>} the resulting query snapshot
	 */
	listChildren(startAt = false, parent, pnyx = false) {
		return new Promise((resolve, reject) => {
			let ref = this.collectionRef(pnyx)
				.where('pinned', '==', false)
				.where('parent', '==', parent)
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

	/**
	 * Retrieves a data query snapshot for the API
	 * supports get functionality
	 * @param {string} [input=''] startAt an optional data key to start listing at
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<QuerySnapshot>} the resulting query snapshot
	 */
	listPinned(startAt = false, pnyx = false) {
		return new Promise((resolve, reject) => {
			let ref = this.collectionRef(pnyx)
				.where('pinned', '==', true)
				.where('parent', '==', '')
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

	/**
	 * Retrieves a data query snapshot for the API
	 * supports get functionality
	 * @param {string} [input=''] startAt an optional data key to start listing at
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<QuerySnapshot>} the resulting query snapshot
	 */
	list(startAt = false, pnyx = false) {
		return new Promise((resolve, reject) => {
			let ref = this.collectionRef(pnyx)
				.where('pinned', '==', false)
				.where('parent', '==', '')
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
