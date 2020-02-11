import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Bouncer from '../../components/layout/bouncer'
import firebase from '../../external/firebase'
import * as error from '../../common/error'

import { openLenny, closeLenny } from '../../components/layout/modal-lenny'

import { PersonaConsumer } from '../../hooks/context/persona'

import {
	InviteRequestsProvider,
	InviteRequestsConsumer,
} from '../../hooks/context/invite-requests'

const sendInvite = (token, email) => {
	return fetch(`/api/persona/unassigned/invite`, {
		method: 'POST',
		body: JSON.stringify({ email: email }),
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	})
}

const removeInviteRequest = (token, uid) => {
	return fetch(`/api/persona/unassigned/remove/${uid}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}

const listAllSignUps = token => {
	return fetch(`/api/persona/unassigned/list`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}

const handleResponse = (response, onError = false) => {
	if (response.status !== 200) {
		if (response.status === 401 || response.status === 403) {
			return Promise.reject(
				`unauthorized access attempt:${response.status}`
			)
		} else {
			return response.json().then(error => {
				return Promise.reject(onError ? onError : error)
			})
		}
	} else {
		try {
			return Promise.resolve(response.json())
		} catch (error) {
			return Promise.reject(error)
		}
	}
}

const Login = () => {
	const [persona, setPersona] = useState(undefined)
	const [email, setEmail] = useState(undefined)
	const [section, setSection] = useState('login')
	const [allowed, setAllowed] = useState(false)
	const [signUpList, setSignupList] = useState([])
	const login = () => {
		const provider = new firebase.auth.GoogleAuthProvider()
		const auth = firebase.auth()
		return auth.signInWithPopup(provider)
	}

	useEffect(() => {
		if (allowed && persona) {
			persona.user
				.getIdToken(true)
				.then(idToken => {
					listAllSignUps(idToken)
						.then(response => handleResponse(response))
						.then(result => {
							setSignupList(result.unassigned)
							setSection('loaded')
						})
				})
				.catch(err => {
					error.standard(err.message)
				})
		} else {
			setSection('login')
		}
	}, [allowed, persona])

	const message = {
		login: {
			body: (
				<div>
					<div className="centered">Welcome to ASMBLY</div>
					<div className="centered">
						<input type="submit" value="login" onClick={login} />
					</div>
				</div>
			),
		},
		logged: {
			body: (
				<div>
					<div className="centered">Welcome to ASMBLY</div>
					<div className="centered">
						<input type="submit" value="login" onClick={login} />
					</div>
				</div>
			),
		},
		loaded: {
			body: (
				<ul className="users">
					{signUpList.map(user => (
						<li key={user.email}>
							<span className="email">{user.email}</span>
							<span className="actions">
								<span
									title="invite"
									onClick={e => {
										openLenny()
										setAllowed(false)
										persona.user
											.getIdToken(true)
											.then(idToken =>
												sendInvite(idToken, user.email)
											)
											.then(response =>
												handleResponse(response)
											)
											.then(posted => {
												if (posted) {
													setAllowed(true)
													closeLenny()
												} else {
													error.standard(
														'invitation failed'
													)
													closeLenny()
												}
											})
									}}
								>
									✉️
								</span>
								<span
									title="remove"
									onClick={e => {
										openLenny()
										setAllowed(false)
										persona.user
											.getIdToken(true)
											.then(idToken =>
												removeInviteRequest(
													idToken,
													user.uid
												)
											)
											.then(response =>
												handleResponse(response)
											)
											.then(posted => {
												if (posted) {
													setAllowed(true)
													closeLenny()
												} else {
													error.standard(
														'invitation removal failed'
													)
													closeLenny()
												}
											})
									}}
								>
									⛔️
								</span>
							</span>
						</li>
					))}
				</ul>
			),
		},
		unauthorized: { body: 'You are not authorized to view this resource' },
	}

	return (
		<PersonaConsumer>
			{persona => {
				setPersona(persona)
				return (
					<div className="content">
						<div className="centered">
							==============================
						</div>
						<div className="centered pointed">
							{message[section].body}
						</div>
						<Bouncer
							staff
							isAllowed={allow => {
								setAllowed(allow)
							}}
						/>
						<div className="centered">
							==============================
						</div>
						<style jsx global>{`
							.users {
								list-style-type: none;
								display: flex;
								flex-direction: column;
								justify-content: flex-start;
								padding-left: 0;
							}
							.users li {
								display: flex;
								flex-direction: row;
								justify-content: space-between;
								align-items: center;
								margin: 0.5em 0;
								font-size: small;
								overflow: hidden;
								text-overflow: ellipsis;
							}

							.actions span {
								margin: 0 0.5em;
								font-size: large;
								cursor: pointer;
							}
						`}</style>
					</div>
				)
			}}
		</PersonaConsumer>
	)
}

export default Login
