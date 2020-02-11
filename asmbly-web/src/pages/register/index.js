import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import ReactDOM from 'react-dom'
import firebase from '../../external/firebase'
import * as error from '../../common/error'

import { openLenny, closeLenny } from '../../components/layout/modal-lenny'

const hasNavBack = ['naming', 'authentication', 'completed']

const hasNavForward = ['naming', 'register']

const checkRegistrationValid = (email, registrationCode) => {
	return fetch(`/api/persona/unassigned/list`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}

const Register = () => {
	const [section, setSection] = useState('register')
	const [email, setEmail] = useState(undefined)
	const [verified, setVerified] = useState(false)
	const [named, setNamed] = useState(false)
	const [complete, setComplete] = useState(false)
	const [password, setPassword] = useState(undefined)
	const [authPref, setAuthPref] = useState(undefined)
	const [personaName, setPersonaName] = useState('')
	const [registrationCode, setRegistrationCode] = useState(undefined)

	useEffect(() => {
		if (verified) {
			closeLenny()
			navForward()
		}
	}, [verified])

	useEffect(() => {
		if (complete) {
			closeLenny()
			navForward()
		}
	}, [complete])

	useEffect(() => {
		if (named) {
			closeLenny()
			navForward()
		}
	}, [named])

	const verifyRegistration = () => {
		const verifyRegistration = firebase
			.functions()
			.httpsCallable('verifyRegistration')

		openLenny()

		verifyRegistration({ email: email, registrationCode: registrationCode })
			.then(verified => {
				setVerified(true)
				firebase.auth().signInWithCustomToken(verified.data.authToken)
				return
			})
			.catch(err => {
				closeLenny()
				error.standard(err.message)
			})
	}
	const completeRegistration = pref => {
		const completeReg = firebase
			.functions()
			.httpsCallable('completeRegistration')

		completeReg({ authPref: pref })
			.then(verified => {
				setComplete(true)
			})
			.catch(err => {
				closeLenny()
				error.standard(err.message)
			})
	}

	const validatePersonaName = () => {
		const validateName = firebase
			.functions()
			.httpsCallable('validatePersonaName')

		openLenny()

		validateName({
			personaName: personaName,
		})
			.then(verified => {
				setNamed(true)
			})
			.catch(err => {
				closeLenny()
				error.standard(err.message)
			})
	}

	const savePassword = () => {
		const savePass = firebase.functions().httpsCallable('savePassword')

		openLenny()

		savePass({
			password: password,
			authPref: authPref,
		})
			.then(verified => {
				setComplete(true)
			})
			.catch(err => {
				closeLenny()
				error.standard(err.message)
			})
	}

	const googleLogin = () => {
		const provider = new firebase.auth.GoogleAuthProvider()

		openLenny()

		firebase
			.auth()
			.currentUser.linkWithPopup(provider)
			.then(result => {
				completeRegistration(authPref)
			})
			.catch(err => {
				closeLenny()
				error.standard(err.message)
			})
	}
	const appleLogin = () => {
		const provider = new firebase.auth.OAuthProvider('apple.com')

		openLenny()

		firebase
			.auth()
			.currentUser.linkWithPopup(provider)
			.then(result => {
				completeRegistration(authPref)
			})
			.catch(err => {
				closeLenny()
				error.standard(err.message)
			})
	}

	const handleAuthPrefChoice = e => {
		setAuthPref(e.target.value)
	}

	const navBack = () => {
		switch (section) {
			case 'naming':
				setSection('register')
				break
			case 'authentication':
				setSection('naming')
				break
			case 'completed':
				setSection('authentication')
				break
			default:
				setSection('completed')
				break
		}
	}

	const navForward = () => {
		switch (section) {
			case 'naming':
				setSection('authentication')
				break
			case 'authentication':
				setSection('completed')
				break
			case 'completed':
				setSection('register')
				break
			default: {
				if (verified) {
					setSection('naming')
				} else {
					error.standard(
						'You must submit a valid email and registration code first.'
					)
				}
				break
			}
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

	let completeAuth = <div className="centered" />

	switch (authPref) {
		case 'google': {
			completeAuth = (
				<div className="centered">
					<input
						type="submit"
						value="login with Google"
						onClick={googleLogin}
					/>
				</div>
			)
			break
		}
		case 'apple': {
			completeAuth = (
				<div className="centered">
					<input
						type="submit"
						value="login with Apple"
						onClick={appleLogin}
					/>
				</div>
			)
			break
		}
		case 'password': {
			completeAuth = (
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
							value="save password"
							onClick={savePassword}
						/>
					</span>
				</div>
			)
			break
		}
	}

	const message = {
		register: {
			lead:
				'Enter the invited email and your registration code to get started',
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
					<br />
					<div className="centered">
						<input
							type="text"
							placeholder="registration code"
							value={registrationCode}
							onInput={e => {
								setRegistrationCode(e.target.value)
							}}
						/>
					</div>
					<br />
					<div className="centered">
						<input
							type="submit"
							value="begin registration"
							onClick={verifyRegistration}
						/>
					</div>
				</div>
			),
		},
		naming: {
			lead:
				'What do you want your persona to be called? (We recommend something other than your real name)',
			body: (
				<div>
					<div className="centered">
						<input
							type="text"
							placeholder="persona name"
							value={personaName}
							onInput={e => {
								setPersonaName(e.target.value)
							}}
							onBlur={e => {}}
						/>
					</div>
					<br />
					<div className="centered">
						<input
							type="submit"
							value="request persona name"
							onClick={validatePersonaName}
						/>
					</div>
				</div>
			),
		},
		authentication: {
			lead: `How would you like to login to ${personaName}?`,
			body: (
				<div>
					<div className="centered column">
						<span>
							<input
								id="appleChoice"
								type="radio"
								name="authPref"
								value="apple"
								checked={authPref === 'apple'}
								onChange={handleAuthPrefChoice}
							/>
							<label for="appleChoice">Apple</label>
						</span>
						<span>
							<input
								id="googleChoice"
								type="radio"
								name="authPref"
								value="google"
								checked={authPref === 'google'}
								onChange={handleAuthPrefChoice}
							/>
							<label for="googleChoice">Google</label>
						</span>
						<span>
							<input
								id="passwordChoice"
								type="radio"
								name="authPref"
								value="password"
								checked={authPref === 'password'}
								onChange={handleAuthPrefChoice}
							/>
							<label for="passwordChoice">password</label>
						</span>
					</div>
					<br />
					{completeAuth}
				</div>
			),
		},
		completed: { leading: '', body: <Redirect to="/pnyx-prime" /> },
	}

	return (
		<div className="content">
			<div className="centered">==============================</div>
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
				.column {
					display: flex;
					flex-direction: column;
				}
				.column span {
					text-align: start;
					padding: 0.25em 0;
					display: flex;
				}
			`}</style>
		</div>
	)
}

export default Register
