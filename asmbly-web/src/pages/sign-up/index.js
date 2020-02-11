import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import firebase from '../../external/firebase'
import * as error from '../../common/error'

import { openLenny, closeLenny } from '../../components/layout/modal-lenny'

const hasNavBack = [
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
	'ten',
	'eleven',
	'twelve',
	'thirteen',
]

const hasNavForward = [
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
	'ten',
	'eleven',
	'twelve',
]

const actionCodeSettings = {
	url: 'https://asmbly.app/verifyRequest',
	handleCodeInApp: true,
}

const SignUp = () => {
	const [section, setSection] = useState('one')
	const [email, setEmail] = useState(undefined)

	useEffect(() => {
		closeLenny()
	}, [])

	const signUp = () => {
		openLenny()
		firebase
			.auth()
			.sendSignInLinkToEmail(email, actionCodeSettings)
			.then(function() {
				window.localStorage.setItem('emailForSignIn', email)
				setSection('fourteen')
				closeLenny()
			})
			.catch(function(err) {
				closeLenny()
				error.standard(err.message)
			})
	}

	const navBack = () => {
		switch (section) {
			case 'two':
				setSection('one')
				break
			case 'three':
				setSection('two')
				break
			case 'four':
				setSection('three')
				break
			case 'five':
				setSection('four')
				break
			case 'six':
				setSection('five')
				break
			case 'seven':
				setSection('six')
				break
			case 'eight':
				setSection('seven')
				break
			case 'nine':
				setSection('eight')
				break
			case 'ten':
				setSection('nine')
				break
			case 'eleven':
				setSection('ten')
				break
			case 'twelve':
				setSection('eleven')
				break
			case 'thirteen':
				setSection('twelve')
				break
			default:
				setSection('thirteen')
				break
		}
	}

	const navForward = () => {
		switch (section) {
			case 'two':
				setSection('three')
				break
			case 'three':
				setSection('four')
				break
			case 'four':
				setSection('five')
				break
			case 'five':
				setSection('six')
				break
			case 'six':
				setSection('seven')
				break
			case 'seven':
				setSection('eight')
				break
			case 'eight':
				setSection('nine')
				break
			case 'nine':
				setSection('ten')
				break
			case 'ten':
				setSection('eleven')
				break
			case 'eleven':
				setSection('twelve')
				break
			case 'twelve':
				setSection('thirteen')
				break
			default:
				setSection('two')
				break
		}
	}

	const keyDownForward = event => {
		if (event.keyCode == 32 || 13 || 39) {
			navForward()
		}
	}
	const keyDownBack = event => {
		if (event.keyCode == 32 || 13 || 37) {
			navBack()
		}
	}

	const showSectionNavBack = section => {
		if (hasNavBack.indexOf(section) > -1) {
			return (
				<span
					tabIndex="1"
					role="button"
					aria-label="go back"
					className="clicky"
					onClick={navBack}
					onKeyDown={keyDownBack}
				>
					⬅️
				</span>
			)
		} else {
			return <span>⏹</span>
		}
	}

	const showSectionNavForward = section => {
		if (hasNavForward.indexOf(section) > -1) {
			return (
				<span
					tabIndex="0"
					role="button"
					aria-label="go forward"
					className="clicky"
					onClick={navForward}
					onKeyDown={keyDownForward}
				>
					➡️
				</span>
			)
		} else {
			return <span>⏹</span>
		}
	}

	const message = {
		one: {
			lead: 'Imagine an internet where',
			body: 'terms of service are defined by the people who participate.',
		},
		two: {
			body:
				'discussion forums are moderated by participants elected from their peers.',
		},
		three: {
			body:
				'participation is limited to verified members of your local community.',
		},
		four: {
			lead: 'We declare interdependence and establish these core rights',
			body: '',
		},
		five: {
			lead: 'The right to organize',
			body:
				'all verified personas have the right to organize a campaign and run for moderator of their local group, the campaign with the most votes leads the moderation of the majority forum, any other campaign obtaining 10% or more of the vote is allowed to form a minority forum in which they are responsible for moderation.',
		},
		six: {
			lead: 'The right to define terms of service',
			body:
				'all verified personas have the right to organize a campaign to petition for changes to the terms of service; a petition signed by ten percent of the community will become an initiative which then requires three fourths of the community vote in an election.',
		},
		seven: {
			lead: 'The right to local participation',
			body:
				'all verified personas are allowed to participate in their local majority forum either sharing their identity or withholding it, while posted content may be moderated or downvoted it cannot be removed. Only in instances where personally identifying information or implications of violence are shared will content be removed.',
		},
		eight: {
			lead: '',
			body:
				'Persona verification is critical to prevent brigading and campaigns to manipulate public opinion.',
		},
		nine: {
			lead: '',
			body:
				'We require all participants hold a valid voter registration in the United States, once you provide your personal details our team will verify your registration in your state and send you a letter in the mail with your approval code.',
		},
		ten: {
			lead: '',
			body:
				'The personal details provided are only ever used to verify your registration, while we process the data it is stored encrypted and is removed from our system upon completion.',
		},
		eleven: {
			lead: '',
			body:
				'Once your approval code has been entered into your account you will gain access to participate in all of your local forums.',
		},
		twelve: {
			lead: '',
			body:
				'Join us in creating the worlds first democratically defined social media platform: ASMBLY',
		},
		thirteen: {
			lead: '',
			body: (
				<div>
					<div className="centered">
						<input
							type="text"
							placeholder="email"
							value={email}
							onInput={e => {
								setEmail(e.target.value)
							}}
						/>
					</div>
					<div className="centered">
						<input
							type="submit"
							value="request invite"
							onClick={signUp}
						/>
					</div>
				</div>
			),
		},
		fourteen: {
			lead: 'Thanks for the request!',
			body:
				'We sent a sign in email to verify your address, once you sign in you will be queued up to be invited to ASMBLY - pnyx prime.',
		},
	}

	return (
		<div className="content">
			<div className="centered nav">
				{showSectionNavBack(section)}
				==============================
				{showSectionNavForward(section)}
			</div>
			<div className="centered pointed">{message[section].lead}</div>
			<div className="centered pointed">{message[section].body}</div>
			<div className="centered">==============================</div>
			<style jsx global>{`
				.nav {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
				.nav span {
					margin: 0 1em;
				}
				.clicky {
					cursor: pointer;
				}
			`}</style>
		</div>
	)
}

export default SignUp
