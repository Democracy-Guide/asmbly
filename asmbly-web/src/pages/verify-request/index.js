import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { openLenny, closeLenny } from '../../components/layout/modal-lenny'

import firebase from '../../external/firebase'
import * as error from '../../common/error'

const errorContent = (
	<div className="content">
		<div class="centered">==============================</div>
		<div class="centered pointed">Something went wrong!</div>
		<div class="centered pointed">
			We were unable to verify your email, please try again or contact
			support@asmbly.app.
		</div>
		<div className="centered">==============================</div>
	</div>
)

const successContent = (
	<div className="content">
		<div class="centered">==============================</div>
		<div class="centered pointed">You are queued up!</div>
		<div class="centered pointed">
			Thanks for the request, keep an eye on your email - invites will
			begin soon.
		</div>
		<div className="centered">==============================</div>
	</div>
)

const empty = (
	<div className="content">
		<div class="centered">==============================</div>
		<div class="centered pointed">Hang on</div>
		<div class="centered pointed">Verifying address...</div>
		<div className="centered">==============================</div>
	</div>
)
const VerifyRequest = () => {
	const [content, setContent] = useState(empty)
	useEffect(() => {
		if (content === empty) {
			if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
				let email = window.localStorage.getItem('emailForSignIn')
				if (!email) {
					email = window.prompt(
						'Please provide your email for confirmation'
					)
				}
				if (email) {
					openLenny()
					firebase
						.auth()
						.signInWithEmailLink(email, window.location.href)
						.then(function(result) {
							window.localStorage.removeItem('emailForSignIn')
							setContent(successContent)
							closeLenny()
						})
						.catch(function(error) {
							setContent(errorContent)
							closeLenny()
						})
				} else {
					setContent(errorContent)
				}
			}
		}
	}, [content])

	return content
}

export default VerifyRequest
