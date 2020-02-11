import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import AppleAuth from './sub/apple-auth'
import GoogleAuth from './sub/google-auth'
import PasswordAuth from './sub/password-auth'

const Authenticate = props => {
	let authenticate = <div />

	switch (props.authPref) {
		case 'google': {
			authenticate = <GoogleAuth />
			break
		}
		case 'apple': {
			authenticate = <AppleAuth />
			break
		}
		case 'password': {
			authenticate = <PasswordAuth email={props.email} />
			break
		}
	}
	return authenticate
}

export default Authenticate
