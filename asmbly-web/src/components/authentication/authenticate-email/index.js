import React, { useState } from 'react'
import firebase from '../../../external/firebase'
import * as error from '../../../common/error'
import { openLenny, closeLenny } from '../../layout/modal-lenny'

const findLoginPreference = (email, setAuthPref) => {
	const emailAuthPreference = firebase
		.functions()
		.httpsCallable('emailAuthPreference')

	openLenny()

	emailAuthPreference({ email: email })
		.then(verified => {
			setAuthPref(verified.data.prefers)
			return
		})
		.catch(err => {
			closeLenny()
			error.standard(err.message)
		})
}

export default props => {
	const [email, setEmail] = useState(undefined)
	return (
		<div>
			<div className="centered">
				<input
					type="text"
					placeholder="email"
					value={email}
					onInput={e => {
						setEmail(e.target.value)
						props.setAuthEmail(e.target.value)
					}}
				/>
			</div>
			<div className="centered">
				<input
					type="submit"
					value="proceed to login"
					onClick={() => {
						findLoginPreference(email, props.setAuthPref)
					}}
				/>
			</div>
		</div>
	)
}
