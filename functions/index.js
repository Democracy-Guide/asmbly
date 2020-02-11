const express = require('express')
const api = express()
const config = require('./api/versioning')
const firebase = require('./lib/firebase')
const registration = require('./callable/registration')
const moderation = require('./triggers')
/*
API
*/
api.use('/api', require('./api'))

exports.server = firebase.functions.https.onRequest(api)

/*
Moderation Triggers
*/
exports.bemaPost = moderation.bemaPost

/*
Registration Callables
*/
exports.verifyRegistration = registration.verifyRegistration

exports.completeRegistration = registration.completeRegistration

exports.validatePersonaName = registration.validatePersonaName

exports.savePassword = registration.savePassword

exports.emailAuthPreference = registration.emailAuthPreference
