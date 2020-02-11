const express = require('express')
const router = express.Router({
	mergeParams: true,
})

const Model = require('./model')
const Control = require('./control')

const control = new Control(new Model())

// POST REPORT
router.post('/:pnyx/item', control.post)

// PUT REPORT
router.put('/:pnyx/item', control.put)

// GET OPEN REPORT LIST
router.get('/:pnyx/open/list', control.getOpenList)

// GET REPORT LIST
router.get('/:pnyx/list', control.getList)

// GET CONTINUED REPORT LIST
router.get('/:pnyx/list/:after', control.getListAfter)

// GET REPORT
router.get('/:pnyx/item/:key', control.get)

// DELETE REPORT
router.delete('/:pnyx/item/:key', control.delete)
module.exports = router
