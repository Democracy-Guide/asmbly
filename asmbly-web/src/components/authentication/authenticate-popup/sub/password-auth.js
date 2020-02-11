import React, { useState } from 'react'
import firebase from '../../../../external/firebase'
import * as error from '../../../../common/error'
import { openLenny, closeLenny } from '../../../layout/modal-lenny'

const passwordLogin = (email, password) => {
	openLenny()

	firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
		.catch(err => {
			closeLenny()
			error.standard(err.message)
		})
}

export default props => {
	const [password, setPassword] = useState(undefined)
	return (
		<div className="centered column">
			<span>
				<input
					type="password"
					placeholder="password"
					value={password}
					onInput={e => {
						setPassword(e.target.value)
					}}
				/>
			</span>
			<span>
				<input
					type="submit"
					value="login"
					onClick={() => passwordLogin(props.email, password)}
				/>
			</span>
		</div>
	)
}
