'use strict'
const express = require('express')
const app = express()
app.use(express.json())

/*
 * make sure request has IP address
 */
const ip = require('../middleware/ip')
app.use(ip)

/*
 * middleware to enforce authentication
 */
const firebase = require('../middleware/firebase')
app.use(firebase)

/*
 * endpoints that do require authentication
 */
const personas = require('./personas')
app.use('/persona', personas)

const reports = require('./reports')
app.use('/report', reports)

const roles = require('./roles')
app.use('/role', roles)

const bemas = require('./bemas')
app.use('/bema', bemas)

module.exports = app
