const express = require('express')
const router = express.Router({
	mergeParams: true,
})

const Model = require('./model')
const Control = require('./control')

const control = new Control(new Model())

// POST ROLE
router.post('/item', control.post)

// PUT ROLE
router.put('/item', control.put)

// GET ROLE LIST
router.get('/list', control.getList)

// GET CONTINUED ROLE LIST
router.get('/list/:after', control.getListAfter)

// GET ROLE
router.get('/item/:key', control.get)

// DELETE ROLE
router.delete('/item/:key', control.delete)
module.exports = router
