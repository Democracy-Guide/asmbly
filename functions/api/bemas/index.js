const express = require('express')
const router = express.Router({
	mergeParams: true,
})

const Model = require('./model')
const Control = require('./control')

const control = new Control(new Model())

// pnyx will determine what type of ACL is required to secure data
// 	pnyx- general access pnyx, content is full public access
// 	persona- persona profile pnyx, has public post access with read and comment access
//		restricted to host and OP
// 	reg- regional pnyx, public read access, post and comment access restricted to verified
//		users from region specified
// 	can- candor pnyx has post and comment access restricted to verified users from region
//		specified who are registered voters

// GET PERSONA BEMA LIST
router.get('/persona/:pnyx/list', control.getPersonaList)

// POST BEMA
router.post('/:pnyx/item', control.post)

// PUT BEMA
router.put('/:pnyx/item', control.put)

// GET BEMA LIST
router.get('/:pnyx/list', control.getList)

// GET CONTINUED BEMA LIST
router.get('/:pnyx/list/:after', control.getListAfter)

// GET CHILD BEMA LIST
router.get('/:pnyx/item/:key/children', control.getChildren)

// GET CONTINUED CHILD BEMA LIST
router.get('/:pnyx/item/:key/children/:after', control.getChildrenAfter)

// GET BEMA
router.get('/:pnyx/item/:key', control.get)

// PATCH MODERATION
router.patch('/:pnyx/item/:key/moderate/:action', control.patchModeration)

// PATCH REPORT
router.patch('/:pnyx/item/:key/report', control.patchReport)

// PATCH REPORT CLOSURE
router.patch(
	'/:pnyx/item/:key/report/:reportKey/close',
	control.patchReportClosure
)

// PATCH FEELS
router.patch('/:pnyx/item/:key/feels/:feeling', control.patchFeels)

// DELETE BEMA
router.delete('/:pnyx/item/:key', control.delete)

module.exports = router
