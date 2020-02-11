const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp()

let db = admin.firestore()

module.exports = { admin: admin, functions: functions }
