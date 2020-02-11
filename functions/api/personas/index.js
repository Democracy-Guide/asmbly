const express = require('express')
const router = express.Router({
	mergeParams: true,
})

const Model = require('./model')
const Control = require('./control')

const control = new Control(new Model())

// POST PERSONA
router.post('/item', control.post)

// PATCH PERSONA MODERATOR
router.patch('/item/:key/promote', control.patchPromote)

// PATCH PERSONA DEMOTE MODERATOR
router.patch('/item/:key/demote', control.patchDemote)

// PUT PERSONA
router.put('/item', control.put)

// GET PERSONA LIST
router.get('/list', control.getList)

// GET CONTINUED PERSONA LIST
router.get('/list/:after', control.getListAfter)

// GET PERSONA
router.get('/item/:key', control.get)

// GET PERSONA MESSAGE LIST
router.get('/item/:key/messages/list', control.getMessageList)

// DELETE PERSONA
router.delete('/item/:key', control.delete)

// DELETE INVITE REQUEST
router.delete('/unassigned/remove/:key', control.deleteInviteRequest)

// GET INVITE REQUESTS LIST
router.get('/unassigned/list', control.listUnassigned)

// POST INVITATION LIST
router.post('/unassigned/invite', control.postInvite)

module.exports = router
