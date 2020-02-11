const fire = require('../lib/firebase')
const RoleModel = require('./roles/model')
const PersonaModel = require('./personas/model')
const ReportModel = require('./reports/model')
const BemaModel = require('./bemas/model')

const db = fire.admin.firestore()

module.exports.findRoleByUID = role => {
	const roleModel = new RoleModel()
	return roleModel.findByUID(role)
}

module.exports.findPersonaByUID = persona => {
	const personaModel = new PersonaModel()
	return personaModel.findByUID(persona)
}

const findPersonaByName = personaName => {
	const personaModel = new PersonaModel()
	return personaModel
		.collectionRef()
		.where('personaName', '==', personaName)
		.get()
}

module.exports.findPersonaByName = findPersonaByName

module.exports.findBemasByUID = (bemas, pnyx) => {
	const bemaModel = new BemaModel()
	return bemaModel
		.collectionRef(pnyx)
		.where('UID', 'in', bemas)
		.get()
}

module.exports.findBemaRef = (bema, pnyx) => {
	const bemaModel = new BemaModel()
	return bemaModel.reference(bema, pnyx)
}

const transactInfluence = (ref, score, db) => {
	return db.runTransaction(transaction => {
		return transaction.get(ref).then(doc => {
			const oldScore = parseInt(doc.data().influenceScore)
			const newScore = oldScore + parseInt(score)

			return transaction.update(ref, {
				influenceScore: newScore,
			})
		})
	})
}
const transactParent = (ref, children, db, sorty) => {
	return db.runTransaction(transaction => {
		return transaction.get(ref).then(doc => {
			const oldChildren = parseInt(doc.data().children)
			const newChildren = oldChildren + children

			const oldDescendants = parseInt(doc.data().descendants)
			const newDescendants = oldDescendants + children

			return transaction.update(ref, {
				children: newChildren,
				descendants: newDescendants,
				sorty: sorty,
			})
		})
	})
}

const transactAncestor = (ref, children, db, sorty) => {
	return db.runTransaction(transaction => {
		return transaction.get(ref).then(doc => {
			const oldDescendants = parseInt(doc.data().descendants)
			const newDescendants = oldDescendants + children

			return transaction.update(ref, {
				descendants: newDescendants,
				sorty: sorty,
			})
		})
	})
}

module.exports.notifyPersonaMessage = async (
	host,
	guest,
	persona,
	ancestor
) => {
	const personaModel = new PersonaModel()
	console.log('notifying', persona, host, guest)
	if (persona === host) {
		const modeled = personaModel.reference(guest).collection('messages')
		return modeled.add({
			host: host,
			guest: guest,
			persona: persona,
			ancestor: ancestor,
			viewed: false,
		})
	} else {
		const modeled = personaModel.reference(host).collection('messages')
		return modeled.add({
			host: host,
			guest: guest,
			persona: persona,
			ancestor: ancestor,
			viewed: false,
		})
	}
}

module.exports.notifyPnyxComment = async (postedBy, parent, ancestor, pnyx) => {
	const bemaModel = new BemaModel()
	const personaModel = new PersonaModel()
	const parentSnap = await bemaModel.get(parent, pnyx)
	const parentData = parentSnap.data()
	if (parentData.postedBy !== postedBy) {
		const personaQuery = await findPersonaByName(parentData.postedBy)
		const modeled = personaQuery.docs[0].ref.collection('messages')
		return modeled.add({
			pnyx: pnyx,
			persona: postedBy,
			ancestor: ancestor,
			viewed: false,
		})
	} else {
		return Promise.resolve()
	}
}

module.exports.getPersonaBema = personaMessage => {
	const personaPnyx = `persona-${personaMessage.host}-${personaMessage.guest}`

	const bemaModel = new BemaModel()

	return bemaModel.list(false, personaPnyx)
}

module.exports.bemaDescendAndInfluence = async (
	bema,
	pnyx,
	isPersona = false
) => {
	const personaModel = new PersonaModel()
	const bemaModel = new BemaModel()
	const personaIn = bema.postedByUID
	if (bema.parent) {
		const parentSnap = await bemaModel.get(bema.parent, pnyx)
		const parentPersonaUID = parentSnap.data().postedByUID

		const selfParent = personaIn === parentPersonaUID

		const parentPersonaRef = personaModel.reference(
			parentSnap.data().postedByUID
		)

		// top level comment
		if (bema.ancestor === bema.parent) {
			// top level comments earn two influence points
			if (personaIn !== parentPersonaUID && !isPersona) {
				await transactInfluence(parentPersonaRef, 2, db)
			}
		} else {
			// influence split between top level ancestor and comment parent
			if (personaIn !== parentPersonaUID && !isPersona) {
				await transactInfluence(parentPersonaRef, 1, db)
			}
			const ancestorSnap = await bemaModel.get(bema.ancestor, pnyx)
			const selfAncestor = personaIn === parentSnap.data().postedByUID

			const ancestorPersonaRef = await personaModel.reference(
				ancestorSnap.data().postedByUID
			)
			// ancestor influence receives remaining influence
			if (!selfAncestor && !isPersona) {
				await transactInfluence(ancestorPersonaRef, 1, db)
			}

			const ancestorRef = bemaModel.reference(bema.ancestor, pnyx)

			await transactAncestor(ancestorRef, 1, db, bema.sorty)
		}

		const parentRef = bemaModel.reference(bema.parent, pnyx)

		await transactParent(parentRef, 1, db, bema.sorty)
	}

	return true
}

module.exports.participate = async (persona, score) => {
	const personaModel = new PersonaModel()

	const personaRef = personaModel.reference(persona)

	await db.runTransaction(transaction => {
		return transaction.get(personaRef).then(doc => {
			const oldScore = parseInt(doc.data().participationScore)
			const newScore = oldScore + parseInt(score)

			return transaction.update(personaRef, {
				participationScore: newScore,
			})
		})
	})

	return personaRef.get(persona).then(doc => {
		return doc.data()
	})
}

module.exports.faced = async (persona, bema) => {
	const personaModel = new PersonaModel()

	const personaRef = personaModel.reference(persona)

	await db.runTransaction(transaction => {
		return transaction.get(personaRef).then(doc => {
			return transaction.update(personaRef, {
				face: bema.face,
				skin: bema.skin,
			})
		})
	})

	return personaRef.get(persona).then(doc => {
		return doc.data()
	})
}

module.exports.report = (persona, bema, pnyx, reason) => {
	const reportModel = new ReportModel()
	return reportModel.set(
		{
			reportKey: `${persona.uid}-4-${bema}`,
			reportedBema: bema,
			reportedBy: persona.name,
			reportedFor: reason,
			reportedOn: new Date().getTime(),
		},
		pnyx
	)
}
module.exports.closeReport = (persona, bema, pnyx, report) => {
	const reportModel = new ReportModel()
	return reportModel.update(report, { closed: true }, pnyx)
}

module.exports.revokeReport = async (persona, bema, pnyx) => {
	const reportModel = new ReportModel()
	const snap = await reportModel
		.collectionRef(pnyx)
		.where('reportedBy', '==', persona.name)
		.where('reportedBema', '==', bema)
		.get()

	if (snap.empty) {
		throw new Error('report does not exist')
	}

	return await reportModel.delete(snap.docs[0].data().UID, pnyx)
}
