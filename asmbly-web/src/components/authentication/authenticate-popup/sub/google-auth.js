import React from 'react'
import firebase from '../../../../external/firebase'
import * as error from '../../../../common/error'
import { openLenny, closeLenny } from '../../../layout/modal-lenny'

const googleLogin = () => {
	const provider = new firebase.auth.GoogleAuthProvider()

	openLenny()

	firebase
		.auth()
		.signInWithPopup(provider)
		.catch(err => {
			closeLenny()
			error.standard(err.message)
		})
}

export default props => {
	return (
		<div className="centered">
			<input
				type="submit"
				value="login with Google"
				onClick={googleLogin}
			/>
		</div>
	)
}
