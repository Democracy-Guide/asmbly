const firebase = require('../lib/firebase')
const config = require('../api/versioning')
const rp = require('request-promise-native')

const api = require('../api/utility')

const baseOptions = {
	method: 'POST',
	uri:
		'https://eastus.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessText/Screen?PII=true&classify=True',
	body: {},
	headers: {
		Accept: 'application/json',
		'Content-Type': 'text/plain',
		'Ocp-Apim-Subscription-Key': 'd9340a57ff3047a6ad09b046379c2e42',
	},
	json: true,
}

const firstPII = pii => {
	return pii.Address
		? 'address'
		: pii.Email
		? 'email'
		: pii.IPA
		? 'IP address'
		: pii.Phone
		? 'phone'
		: pii.SSN
		? 'social security'
		: 'unknown'
}

const mapPnyx = pnyx => {
	const comp = pnyx.split('-')

	return { type: comp[0], comp: comp, orig: pnyx }
}
exports.bemaPost = firebase.functions.firestore
	.document(
		`/${config.appCollection}/${config.appVersion}/${
			config.pnyxManaged
		}/{pnyx}/bema/{UID}`
	)
	.onWrite(async (change, context) => {
		const options = { ...baseOptions }
		const bemaAfter = change.after.exists ? change.after.data() : false
		const bemaBefore = change.before.exists ? change.before.data() : false
		if (bemaBefore) {
			return true
		}
		if (bemaAfter) {
			const pnyxMap = mapPnyx(context.params.pnyx)

			let textContent = `${bemaAfter.contention} ${bemaAfter.speech}`

			options.body = textContent

			const isPersona = pnyxMap.type === 'persona'

			let moderated = {
				Classification: {
					Persona: isPersona,
					ReviewRecommended: false,
				},
				PII: false,
			}

			if (!isPersona) {
				moderated = await rp(options)
			}

			if (isPersona) {
				const host = pnyxMap.comp[1]
				const guest = bemaAfter.guest

				await api.notifyPersonaMessage(
					host,
					guest,
					bemaAfter.postedBy,
					bemaAfter.ancestor
				)
			} else if (bemaAfter.parent) {
				await api.notifyPnyxComment(
					bemaAfter.postedBy,
					bemaAfter.parent,
					bemaAfter.ancestor,
					bemaAfter.pnyx
				)
			}

			await api.bemaDescendAndInfluence(
				bemaAfter,
				bemaAfter.pnyx,
				isPersona
			)

			if (moderated.PII) {
				const report = await api.report(
					{
						uid: moderated.TrackingId,
						name: 'Azure Classifier',
					},
					bemaAfter.UID,
					bemaAfter.pnyx,
					`potential PII ${firstPII(moderated.PII)}`
				)

				const oldScore = parseInt(bemaAfter.reported)

				let reported = oldScore + 1

				let reporters = bemaAfter.reporters
				let reports = bemaAfter.reports ? bemaAfter.reports : []

				reporters.push(moderated.TrackingId)
				reports.push(report.UID)

				return change.after.ref.set(
					{
						autoModeration: moderated,
						reported: reported,
						reporters: reporters,
						reports: reports,
						prohibited: true,
						moderationReason:
							'automated scan detected personally identifying information',
					},
					{ merge: true }
				)
			}

			if (moderated.Classification.ReviewRecommended) {
				const report = await api.report(
					{
						uid: moderated.TrackingId,
						name: 'Azure Classifier',
					},
					bemaAfter.UID,
					bemaAfter.pnyx,
					'potentially offensive'
				)

				const oldScore = parseInt(bemaAfter.reported)

				let reported = oldScore + 1

				let reporters = bemaAfter.reporters
				let reports = bemaAfter.reports ? bemaAfter.reports : []

				reporters.push(moderated.TrackingId)
				reports.push(report.UID)

				return change.after.ref.set(
					{
						autoModeration: moderated,
						reported: reported,
						reporters: reporters,
						reports: reports,
					},
					{ merge: true }
				)
			}

			return change.after.ref.set(
				{
					autoModeration: moderated,
				},
				{ merge: true }
			)
		} else {
			return true
		}
	})
