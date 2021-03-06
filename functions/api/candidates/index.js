const express = require('express')
const router = express.Router({
	mergeParams: true,
})

const Model = require('./model')
const Control = require('./control')

const control = new Control(new Model())

// GET CANDIDATE LIST
router.get('/list', control.getList)

// GET CONTINUED CANDIDATE LIST
router.get('/list/:after', control.getListAfter)

// GET CANDIDATE
router.get('/item/:key', control.get)

module.exports = router
