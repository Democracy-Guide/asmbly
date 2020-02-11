const validator = require('validator')
const DefaultModel = require('../base-model')

const security = { key: 'system', permission: 'manage-roles' }

const collection = 'roles'
const orderBy = 'UID'
const unique = 'roleTitle'
const default_model = {
	roleTitle: {
		required: true,
		default: '',
	},
	roleAccess: {
		required: true,
		validator: validator.isIn,
		options: ['limited-access', 'full-access'],
	},
	roleLocked: {
		required: true,
		default: false,
		validator: validator.isBoolean,
	},
	roleType: {
		required: true,
		validator: validator.isIn,
		options: ['staff', 'pnyx'],
	},
	permissions: {
		required: false,
		default: [],
	},
}

module.exports = class Model extends DefaultModel {
	constructor() {
		super(collection, orderBy, unique, security, default_model)
	}

	/**
	 * Determine read access for role
	 * overriden to allow global read access
	 * @param {role} role the role being evaluated for access
	 * @returns {boolean} representing read permission
	 */
	canRead(role) {
		return ['system', 'pnyx'].indexOf(role.roleType) > -1
	}

	findByUID(uid, pnyx = false) {
		return this.reference(uid, pnyx)
			.get()
			.then(doc => {
				return doc.data()
			})
			.catch(err => {
				return Promise.reject(err)
			})
	}
}
