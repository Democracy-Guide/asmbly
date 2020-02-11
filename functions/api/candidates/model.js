const validator = require('validator')
const DefaultModel = require('../base-model')

const security = { key: 'public', permission: 'candidate-content' }

const collection = 'candidates'
const orderBy = 'UID'
const unique = 'personID'
const default_model = {
	name: {
		required: true,
		default: '',
	},
	firstName: {
		required: true,
		default: 'us',
	},
	lastName: {
		required: false,
		default: '',
	},
	ballotpediaURL: {
		required: true,
		default: '',
	},
	personID: {
		required: true,
		default: '',
	},
	gender: {
		required: false,
		default: '',
	},
	partyAffiliation: {
		required: false,
		default: '',
	},
	incumbent: {
		required: true,
		default: ['Yes', 'No'],
	},
	primaryStatus: {
		required: false,
		default: '',
	},
	primaryVotes: {
		required: false,
		default: '',
	},
	primaryOtherVotes: {
		required: false,
		default: '',
	},
	primaryRunoffStatus: {
		required: false,
		default: '',
	},
	primaryRunoffVotes: {
		required: false,
		default: '',
	},
	primaryRunoffOtherVotes: {
		required: false,
		default: '',
	},
	generalStatus: {
		required: false,
		default: '',
	},
	generalVotes: {
		required: false,
		default: '',
	},
	generalOtherVotes: {
		required: false,
		default: '',
	},
	generalRunoffStatus: {
		required: false,
		default: '',
	},
	generalRunoffVotes: {
		required: false,
		default: '',
	},
	generalOtherRunoffVotes: {
		required: false,
		default: '',
	},
	persona: {
		required: false,
		default: '',
	},
	race: {
		required: true,
		default: '',
	},
	initializedBy: {
		required: true,
		default: '',
	},
	campaignFacebook: {
		required: false,
		default: '',
	},
	campaignWebsite: {
		required: false,
		default: '',
	},
	campaignPhoto: {
		required: false,
		default: '',
	},
	campaignDescription: {
		required: false,
		default: '',
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

	/**
	 * Utility for generating unique UID
	 * @param {string} unique the unique key to seed UID with
	 * @param {Object} merged the data object UID is for
	 * @returns {string} a data model specific UID
	 */
	generateUID(unique, merged) {
		return uuidv5(`${merged[unique]}`, namespace)
	}
}
