const express = require('express')
const router = express.Router({
	mergeParams: true,
})

const Model = require('./model')
const Control = require('./control')

const control = new Control(new Model())

// GET RACE LIST
router.get('/list', control.getList)

// GET CONTINUED RACE LIST
router.get('/list/:after', control.getListAfter)

// GET RACE
router.get('/item/:key', control.get)

module.exports = router
