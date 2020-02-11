import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Bouncer from '../../components/layout/bouncer'
import firebase from '../../external/firebase'
import * as error from '../../common/error'

import { openLenny, closeLenny } from '../../components/layout/modal-lenny'

import { PersonaConsumer } from '../../hooks/context/persona'

const promotePersona = (token, uid) => {
	return fetch(`/api/persona/item/${uid}/promote`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}

const demotePersona = (token, uid) => {
	return fetch(`/api/persona/item/${uid}/demote`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}

const listAllPersonas = token => {
	return fetch(`/api/persona/list`, {
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
	const [personaList, setPersonaList] = useState([])
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
					listAllPersonas(idToken)
						.then(response => handleResponse(response))
						.then(result => {
							setPersonaList(result)
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
					{personaList.map(user => (
						<li key={user.personaName}>
							<span className="persona-detail">
								<span className="personaName">
									{user.personaName
										? user.personaName
										: user.email}
								</span>
								<span className="pnyx">
									{JSON.stringify(user.pnyx)}
								</span>
							</span>
							<span className="actions">
								<span
									className={
										user.moderator
											? 'unavailable'
											: 'notice'
									}
									title="promote"
									onClick={e => {
										openLenny()
										setAllowed(false)
										persona.user
											.getIdToken(true)
											.then(idToken => {
												return promotePersona(
													idToken,
													user.UID
												)
											})
											.then(response =>
												handleResponse(response)
											)
											.then(result => {
												setAllowed(true)
												closeLenny()
											})
											.catch(err => {
												error.standard(err.message)
												closeLenny()
											})
									}}
								>
									👆
								</span>
								<span
									className={
										user.moderator
											? 'notice'
											: 'unavailable'
									}
									title="demote"
									onClick={e => {
										openLenny()
										setAllowed(false)
										persona.user
											.getIdToken(true)
											.then(idToken => {
												return demotePersona(
													idToken,
													user.UID
												)
											})
											.then(response =>
												handleResponse(response)
											)
											.then(result => {
												setAllowed(true)
												closeLenny()
											})
											.catch(err => {
												error.standard(err.message)
												closeLenny()
											})
									}}
								>
									👇
								</span>
								<span
									className="notice"
									title="suspend"
									onClick={e => {
										openLenny()
										setAllowed(false)
										setAllowed(true)
										closeLenny()
									}}
								>
									⛔
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
								filter: grayscale(100%);
							}
							.actions .notice {
								filter: none;
							}

							.persona-detail {
								display: flex;
								flex-direction: column;
								align-items: flex-start;
							}
						`}</style>
					</div>
				)
			}}
		</PersonaConsumer>
	)
}

export default Login
