const validator = require('validator')
const uuidv5 = require('uuid/v5')
const appDomain = 'paytheory.com'
const namespace = uuidv5(appDomain, uuidv5.DNS)
const fire = require('../lib/firebase')

const db = fire.admin.firestore()

/*
 * Constants that identify data collection location
 */
const config = require('./versioning')

/**
 * Utility for composing a default model object for a given definition
 * internal method
 * @param {Object} the incoming model to be instantiated
 * @returns {Object} the composed default model.
 */
const _buildModel = model => {
	let built = {}
	Object.keys(model).forEach(key => {
		built[key] = model[key].default
	})
	return built
}

/**
 * Utility for identifying objects
 * internal method
 * @param {any} val the incoming variable to be checked
 * @returns {boolean} representing the objectness of provided variable
 */
const _isObject = val => {
	if (val === null) {
		return false
	}
	return typeof val === 'function' || typeof val === 'object'
}

/**
 * Utility for determining if non string content should be converted to string
 * internal method
 * @param {any} value the incoming variable to be checked
 * @param {validator} validator the validator specified for a given model property
 * @returns {boolean} representing if the variable should be cast to string
 */
const showAsString = (value, validator) => {
	if (validator || _isObject(value)) {
		return false
	} else {
		return true
	}
}

/**
 * A generic ASMBLY data model
 */
module.exports = class DefaultModel {
	/**
	 * Must be run from super class
	 * Establishes data access pattern
	 * @param {string} _collection the collection underlying this model
	 * @param {string} _orderBy the property to order the model by
	 * @param {string} _unique the unique key for this model
	 * @param {string} _security the security object defining role access for this model
	 * @param {string} _model the model definition object
	 */
	constructor(_collection, _orderBy, _unique, _security, _model) {
		if (new.target === DefaultModel) {
			throw new TypeError(
				'Cannot construct DefaultModel instances directly'
			)
		}
		this.collection = _collection
		this.definition = _model
		this.model = _buildModel(_model)
		this.orderBy = _orderBy
		this.unique = _unique
		this.security = _security

		this.hasWritePermission = this.hasWritePermission.bind(this)
		this.canWrite = this.canWrite.bind(this)
		this.hasReadPermission = this.hasReadPermission.bind(this)
		this.canRead = this.canRead.bind(this)
		this.pnyxManaged = this.pnyxManaged.bind(this)
		this.collectionRef = this.collectionRef.bind(this)
		this.reference = this.reference.bind(this)
		this.merge = this.merge.bind(this)
		this.validate = this.validate.bind(this)
		this.findByUID = this.findByUID.bind(this)
		this.generateUID = this.generateUID.bind(this)

		this.get = this.get.bind(this)
		this.set = this.set.bind(this)
		this.update = this.update.bind(this)
		this.delete = this.delete.bind(this)
		this.list = this.list.bind(this)
	}

	/**
	 * Determine write access for role based on permissions
	 * @param {array} permissions the permissions array to evaluate
	 * @param {role} role the role being evaluated for access
	 * @returns {boolean} representing write permission
	 */
	hasWritePermission(permissions) {
		const found = permissions.find(permitted => {
			return (
				permitted.tag === this.security.permission &&
				permitted.permission === 'read-write'
			)
		})
		return found
	}

	/**
	 * Determine write access for role
	 * @param {role} role the role being evaluated for access
	 * @returns {boolean} representing write permission
	 */
	canWrite(role, uid) {
		if (role.roleAccess === 'full-access') {
			return role.roleType === this.security.key
		} else {
			return role.roleType === this.security.key
				? this.hasWritePermission(role.permissions)
				: false
		}
	}

	/**
	 * Determine read access for role based on permissions
	 * @param {array} permissions the permissions array to evaluate
	 * @param {role} role the role being evaluated for access
	 * @returns {boolean} representing read permission
	 */
	hasReadPermission(permissions) {
		const found = permissions.find(permitted => {
			return permitted.tag === this.security.permission
		})
		return found
	}

	/**
	 * Determine read access for role
	 * @param {role} role the role being evaluated for access
	 * @returns {boolean} representing read permission
	 */
	canRead(role, uid) {
		if (role.roleAccess === 'full-access') {
			return true
		} else {
			return role.roleType === this.security.key
				? this.hasReadPermission(role.permissions)
				: false
		}
	}

	/**
	 * Retrieve pnyx managed data reference root
	 * @returns {reference} firestore data reference
	 */
	pnyxManaged() {
		return db
			.collection(config.appCollection)
			.doc(config.appVersion)
			.collection(config.pnyxManaged)
	}

	/**
	 * Retrieve pnyx data collection reference
	 * @param {any} [input=false] pnyx a string or boolean indicating where to look for data, false indicates data is not pnyx related
	 * @returns {reference} firestore data reference
	 */
	collectionRef(pnyx = false) {
		if (pnyx) {
			return db
				.collection(config.appCollection)
				.doc(config.appVersion)
				.collection(config.pnyxManaged)
				.doc(pnyx)
				.collection(this.collection)
		} else {
			return db
				.collection(config.appCollection)
				.doc(config.appVersion)
				.collection(this.collection)
		}
	}

	/**
	 * Retrieve pnyx data item reference
	 * @param {string} key the key for identifying data object
	 * @param {any} [input=false] pnyx a string or boolean indicating where to look for data, false indicates data is not pnyx related
	 * @returns {reference} firestore data reference
	 */
	reference(key, pnyx = false) {
		let ref = false
		if (pnyx) {
			/* istanbul ignore next */
			ref = db
				.collection(config.appCollection)
				.doc(config.appVersion)
				.collection(config.pnyxManaged)
				.doc(pnyx)
				.collection(this.collection)
				.doc(key)
		} else {
			/* istanbul ignore next */
			ref = db
				.collection(config.appCollection)
				.doc(config.appVersion)
				.collection(this.collection)
				.doc(key)
		}
		return ref
	}

	/**
	 * Merge incoming data with data model defaults
	 * @param {Object} item the incoming data to be merged
	 * @returns {Object} a composed data object with UID
	 */
	merge(item) {
		let merged = {}
		Object.entries(this.model).forEach(property => {
			const key = property[0]
			const val = property[1]

			merged[key] = item[key]
			if (merged[key] === undefined) {
				merged[key] = val
			}
		})
		if (item.UID) {
			merged.UID = item.UID
		} else {
			merged.UID = this.generateUID(this.unique, merged)
		}
		return merged
	}

	/**
	 * Validate incoming data
	 * @param {Object} item the incoming data to be validated
	 * @returns {object} the validation result and missing element that triggered invalidation if relevant
	 */
	validate(item) {
		let incoming = { ...item }
		let valid = true
		let missing = ''
		Object.entries(this.definition).forEach(property => {
			const key = property[0]
			const val = property[1]

			const validation = val.validator
				? val.validator
				: validator.isLength
			const options = val.options ? val.options : { min: 1 }

			incoming[key] =
				incoming[key] === undefined ? val.default : incoming[key]

			// if content is not an object and no validator is specified convert to string
			const check = showAsString(incoming[key], val.validator)
				? incoming[key].toString()
				: incoming[key]

			if (val.required && valid) {
				if (_isObject(check)) {
					valid = Object.keys(check).length > 0
				} else if (typeof check === 'boolean') {
					valid = validation(check.toString(), options)
				} else {
					valid = validation(check, options)
				}

				if (!valid) {
					missing = `invalid ${key} - ${check}`
				}
			}
		})
		return { valid: valid, missing: missing }
	}

	/**
	 * Utility for generating unique UID
	 * @param {string} unique the unique key to seed UID with
	 * @param {Object} merged the data object UID is for
	 * @returns {string} a data model specific UID
	 */
	generateUID(unique, merged) {
		return uuidv5(`${merged[unique]}${new Date().getTime()}`, namespace)
	}

	/**
	 * Utility for retrieving data by UID
	 * @param {string} uid the identifier for data object
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<Object>} the retrieved data object
	 */
	findByUID(uid, pnyx = false) {
		return this.reference(uid, pnyx)
			.get()
			.then(doc => {
				return doc.data()
			})
	}

	/**
	 * Retrieves a data snapshot for the API
	 * supports get functionality
	 * @param {string} uid the identifier for data object
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<snapshot>} the retrieved data snapshot
	 */
	get(key, pnyx = false) {
		return new Promise((resolve, reject) => {
			this.reference(key, pnyx)
				.get()
				.then(doc => {
					if (doc.exists) {
						return resolve(doc)
					} else {
						return reject(new Error(`no item found for ${key}`))
					}
				})
				.catch(err => {
					return reject(err)
				})
		})
	}

	/**
	 * Sets a data object for the API
	 * supports post functionality
	 * @param {Object} val the data object
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<Object>} the saved data object
	 */
	set(val, pnyx = false) {
		const merged = this.merge(val)

		const validated = this.validate(merged)

		if (!validated.valid) {
			return Promise.reject(new Error(validated.missing))
		} else {
			return this.reference(merged.UID, pnyx)
				.set(merged)
				.then(() => {
					return Promise.resolve(merged)
				})
				.catch(err => {
					/* istanbul ignore next */
					return Promise.reject(err)
				})
		}
	}

	/**
	 * Updates a data object for the API
	 * supports put functionality
	 * @param {string} key the data object identifier
	 * @param {Object} val the updated data object
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<Object>} the updated data object
	 */
	update(key, val, pnyx = false) {
		return this.reference(key, pnyx)
			.get()
			.then(doc => {
				if (doc.exists) {
					const merged = this.merge({ ...doc.data(), ...val })
					const validated = this.validate(merged)
					/* istanbul ignore next */
					if (!validated.valid) {
						return Promise.reject(
							new Error(`invalid update: ${validated.missing}`)
						)
					}
					return this.reference(key, pnyx).update(val)
				} else {
					return Promise.reject(new Error('no item found'))
				}
			})
			.then(() => this.get(key, pnyx))
			.then(doc => {
				return doc.data()
			})
	}

	/**
	 * Deletes a data object for the API
	 * supports delete functionality
	 * @param {string} key the data object identifier
	 * @param {any} pnyx the related pnyx if relevant, false if not
	 * @returns {Promise<string>} the deleted object key
	 */
	delete(key, pnyx = false) {
		return new Promise((resolve, reject) => {
			this.reference(key, pnyx)
				.delete()
				.then(() => {
					return resolve(key)
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
