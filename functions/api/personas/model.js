const fire = require('../../lib/firebase')
const mail = require('../../lib/mailchimp')
const validator = require('validator')
const DefaultModel = require('../base-model')
const RegistrationCode = require('./registration-code')

const security = { key: 'staff', permission: 'sub-page-variable' }

const collection = 'personas'
const orderBy = 'UID'
const unique = 'email'
const default_model = {
	personaName: {
		required: false,
		default: '',
	},
	email: {
		required: true,
		default: '',
		validator: validator.isEmail,
		options: {},
	},
	title: {
		required: false,
		default: '',
	},
	verifiedBy: {
		required: false,
		default: '',
	},
	verifiedOn: {
		required: false,
		validator: validator.isDate,
		default: '',
	},
	invitedBy: {
		required: false,
		default: '',
	},
	invitedOn: {
		required: false,
		validator: validator.isDate,
		default: '',
	},
	registrationCode: {
		required: false,
		default: '',
	},
	moderator: {
		required: false,
		default: false,
	},
	role: {
		required: true,
		default: '',
	},
	roleType: {
		required: true,
		default: '',
	},
	pnyx: {
		required: true,
		validator: validator.isArray,
		default: [],
	},
	authPref: {
		required: true,
		default: 'email-only',
		validator: validator.isIn,
		options: ['email-only', 'google', 'apple', 'password'],
	},
	participationScore: {
		required: true,
		default: 0,
	},
	influenceScore: {
		required: true,
		default: 0,
	},
	face: {
		required: true,
		default: '1F937',
	},
	skin: {
		required: false,
		default: '',
	},
	messages: {
		required: false,
		default: [],
	},
}

module.exports = class Model extends DefaultModel {
	constructor() {
		super(collection, orderBy, unique, security, default_model)
		this.listUnassigned = this.listUnassigned.bind(this)
		this.postInvite = this.postInvite.bind(this)
		this.setInviteeClaims = this.setInviteeClaims.bind(this)
		this.createInviteePersona = this.createInviteePersona.bind(this)
	}

	/**
	 * Determine read access for role
	 * @param {role} role the role being evaluated for access
	 * @returns {boolean} representing read permission
	 */
	canRead(role, uidMatch = false) {
		if (role.roleAccess === 'full-access') {
			return true
		} else {
			return uidMatch
		}
	}

	setInviteeClaims(persona) {
		return fire.admin
			.auth()
			.setCustomUserClaims(persona.UID, {
				role: 'participant',
			})
			.then(() => persona)
	}

	createInviteePersona(email, uid) {
		return this.set({
			email: email,
			UID: uid,
			roleType: 'public',
			role: 'participant',
			registrationCode: RegistrationCode.generate(),
			pnyx: ['pnyx-prime'],
		})
	}

	removeInviteRequest(uid) {
		return fire.admin
			.auth()
			.deleteUser(uid)
			.then(() => {
				return { success: true }
			})
			.catch(err => {
				return { success: false, error: err }
			})
	}

	postInvite(email) {
		return fire.admin
			.auth()
			.getUserByEmail(email)
			.then(userRecord => {
				return this.createInviteePersona(email, userRecord.uid)
			})
			.then(persona => {
				return this.setInviteeClaims(persona)
			})
			.then(persona => {
				return mail.applyRegistration(email, persona.registrationCode)
			})
			.then(() => {
				return mail.sendInvite(email)
			})
			.then(() => {
				return { success: true }
			})
			.catch(err => {
				return { success: false, error: err }
			})
	}

	listUnassigned() {
		return fire.admin
			.auth()
			.listUsers(100)
			.then(userRecords => {
				const unassigned = []
				userRecords.users.forEach(user => {
					if (!user.customClaims) {
						unassigned.push(user.toJSON())
					}
				})
				return { unassigned: unassigned }
			})
	}
}
