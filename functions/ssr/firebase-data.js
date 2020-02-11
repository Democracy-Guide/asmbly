const firebase = require('firebase/app')
require('firebase/database')

// We initialize Firebase using a client-side config.
const firebaseConfig = require('./firebase-config.json').result
;(firebase.default || firebase).initializeApp(firebaseConfig)

// Get and return all employees
async function getFreshSignUps() {
	const snap = await firebase
		.database()
		.ref('/employees')
		.orderByChild('level')
		.once('value')
	return { employees: snap.val() }
}

// Get and return an employee by their id number
// also fetch all of the employee's direct reports (if any)
async function getEmployeeById(employeeId) {
	let employee
	const snap = await firebase
		.database()
		.ref(`/employees/${employeeId}`)
		.once('value')
	employee = snap.val()
	const reportIds = Object.keys(employee.reports || [])
	const getReports = reportIds.map(userId =>
		firebase
			.database()
			.ref(`/employees/${userId}`)
			.once('value')
	)
	const reportSnapshots = await Promise.all(getReports)
	reports = reportSnapshots.map(snap => snap.val())
	return { employee, reports: reports }
}

module.exports = {
	getAllEmployees,
	getEmployeeById,
}
