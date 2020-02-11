const crypto = require('crypto')
const Mailchimp = require('mailchimp-api-v3')
const mailchimp = new Mailchimp('19d6e200c6041595688d6508cf19c105-us5')

const sendInviteWorkflowID = '4ff1efc5ef'
const sendInviteWorkflowEmailID = '3e19f9c07a'

const inviteRequestListID = '9d3d0f6c73'

module.exports.applyRegistration = (email, code) => {
	let hash = crypto
		.createHash('md5')
		.update(email)
		.digest('hex')
	return mailchimp.patch(`/lists/${inviteRequestListID}/members/${hash}`, {
		merge_fields: { REG_CODE: code },
	})
}

module.exports.sendInvite = email => {
	return mailchimp.post(
		`/automations/${sendInviteWorkflowID}/emails/${sendInviteWorkflowEmailID}/queue`,
		{
			email_address: email,
		}
	)
}
