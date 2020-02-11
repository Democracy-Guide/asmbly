const validator = require('validator')
const DefaultModel = require('../base-model')

const security = { key: 'public', permission: 'race-content' }

const collection = 'races'
const orderBy = 'officeSought'
const unique = 'officeSought'
const default_model = {
	initializedBy: {
		required: true,
		default: '',
	},
	electionYear: {
		required: true,
		default: '',
	},
	country: {
		required: true,
		default: 'US',
	},
	state: {
		required: false,
		default: '',
	},
	raceType: {
		required: true,
		default: '',
	},
	officeLevel: {
		required: true,
		validator: validator.isIn,
		options: ['Federal', 'State', 'Local'],
	},
	officeBranch: {
		required: true,
		validator: validator.isIn,
		options: ['Executive', 'Legislative', 'Judicial'],
	},
	districtType: {
		required: true,
		validator: validator.isIn,
		options: [
			'Country',
			'State',
			'Congress',
			'State',
			'Congress',
			'State Legislative (Upper)',
			'State Legislative (Lower)',
			'County',
			'School District',
			'School Board District',
			'City',
			'Judicial District',
			'Special District',
			'Local Subdivision',
		],
	},
	districtOCDID: {
		required: false,
		default: '',
	},
	officeSought: {
		required: true,
		default: '',
	},
	seatsUp: {
		required: true,
		default: '',
	},
	raceURL: {
		required: true,
		default: '',
	},
	primaryDate: {
		required: true,
		default: '',
	},
	generalElectionDate: {
		required: true,
		default: '',
	},
	primaryRunoffDate: {
		required: false,
		default: '',
	},
	generalElectionRunoffDate: {
		required: false,
		default: '',
	},
	tooCloseToCall: {
		required: false,
		default: '',
	},
	tooCloseToCall: {
		required: false,
		default: '',
	},
	generalResultsCertified: {
		required: true,
		default: 'No',
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
	 * Here the faux unique key is prefixed by election year
	 * making it actually unique
	 * @param {string} unique the unique key to seed UID with
	 * @param {Object} merged the data object UID is for
	 * @returns {string} a data model specific UID
	 */
	generateUID(unique, merged) {
		return uuidv5(`${merged['electionYear']}${merged[unique]}`, namespace)
	}
}
