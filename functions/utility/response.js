const { Logging } = require('@google-cloud/logging')
const logging = new Logging()

const API_METADATA = {
	resource: {
		type: 'cloud_function',
		labels: {
			function_name: 'api',
			region: 'us-central1',
		},
	},
}

module.exports.API_METADATA = API_METADATA

module.exports.DEFAULT = 'Default'

module.exports.PERSONAS = 'Personas'

const isInTest = typeof global.it === 'function'

/**
 * Logs an API error
 * static method
 * @param {string} logname the log to post to
 * @param {string} event the event to post
 * @param {string} email the email associated through authentication
 * @param {string} ip the IP the request originates from
 * @param {Error} error the error associated with event
 * @param {Object} METADATA details for organizing logs
 */
const error = (logname, event, email, ip, error, METADATA = API_METADATA) => {
	console.log('logging error', METADATA)
	if (isInTest) return
	let log = logging.log(`${logname}-error`)
	const data = {
		event: event,
		email: email,
		ip: ip,
		message: `${email}:::${ip}:::${error.message}`,
	}
	const entry = log.entry(METADATA, data)
	if (log) {
		log.write(entry)
	}
}

module.exports.error = error

/**
 * Logs an API success
 * static method
 * @param {string} logname the log to post to
 * @param {string} event the event to post
 * @param {string} email the email associated through authentication
 * @param {string} ip the IP the request originates from
 * @param {string} message the message associated with event
 * @param {Object} METADATA details for organizing logs
 */
const success = (
	logname,
	event,
	email,
	ip,
	message,
	METADATA = API_METADATA
) => {
	console.log('logging success', METADATA)
	if (isInTest) return

	let log = logging.log(`${logname}-success`)
	const data = {
		event: event,
		email: email,
		ip: ip,
		message: `${email}:::${ip}:::${message}`,
	}
	const entry = log.entry(METADATA, data)
	if (log) {
		log.write(entry)
	}
}

module.exports.success = success

/**
 * Log and send an API success
 * static method
 * @param {string} logname the log to post to
 * @param {string} event the event to post
 * @param {string} ip the IP the request originates from
 * @param {any} body the response body
 * @param {string} email the email associated through authentication
 * @param {response} res the response object to send
 * @param {Object} METADATA details for organizing logs
 * @returns the sent response
 */
module.exports.send200 = (
	logname,
	event,
	ip,
	body,
	email,
	res,
	METADATA = API_METADATA
) => {
	const message = `${event} ${email}`
	//success(logname, event, email, ip, message, METADATA)
	return res.status(200).send(body)
}

/**
 * Log and send an API failure: 400
 * static method
 * @param {string} logname the log to post to
 * @param {string} event the event to post
 * @param {string} ip the IP the request originates from
 * @param {Error} the error details
 * @param {string} email the email associated through authentication
 * @param {response} res the response object to send
 * @param {Object} METADATA details for organizing logs
 * @returns the sent response
 */
module.exports.send400 = (
	logname,
	event,
	ip,
	err,
	email,
	res,
	METADATA = API_METADATA
) => {
	const errorMessage = err.message
	const message = `${event} ${email} ${err.message}`
	//error(logname, event, email, ip, message, METADATA)

	return res.status(400).send({ state: 'error', reason: err.message })
}

/**
 * Log and send an API failure: 401
 * static method
 * @param {string} logname the log to post to
 * @param {string} event the event to post
 * @param {string} ip the IP the request originates from
 * @param {Error} the error details
 * @param {string} email the email associated through authentication
 * @param {response} res the response object to send
 * @param {Object} METADATA details for organizing logs
 * @returns the sent response
 */
module.exports.send401 = (
	logname,
	event,
	ip,
	err,
	email,
	res,
	METADATA = API_METADATA
) => {
	const errorMessage = err.message
	const message = `${event} ${email} ${errorMessage}`
	//error(logname, event, email, ip, message, METADATA)

	return res.status(401).send('Unauthorized')
}

/**
 * Log and send an API failure: 403
 * static method
 * @param {string} logname the log to post to
 * @param {string} event the event to post
 * @param {string} ip the IP the request originates from
 * @param {Error} the error details
 * @param {string} email the email associated through authentication
 * @param {response} res the response object to send
 * @param {Object} METADATA details for organizing logs
 * @returns the sent response
 */
module.exports.send403 = (
	logname,
	event,
	ip,
	err,
	email,
	res,
	METADATA = API_METADATA
) => {
	const errorMessage = err.message
	const message = `${event} ${email} ${errorMessage}`
	//error(logname, event, email, ip, message, METADATA)

	return res.status(403).send(message)
}
