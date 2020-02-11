import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { PersonaConsumer } from '../../../hooks/context/persona'
import * as error from '../../../common/error'
import { formatCount } from '../../../lib/format.js'

import { openLenny, closeLenny } from '../../layout/modal-lenny'

const patchFeels = (token, bema, feeling) => {
	return fetch(`/api/bema/pnyx-prime/item/${bema}/feels/${feeling}`, {
		method: 'PATCH',
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

const patchReport = (token, bema, reason) => {
	return fetch(`/api/bema/pnyx-prime/item/${bema}/report`, {
		method: 'PATCH',
		body: JSON.stringify(reason),
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	})
}
const patchRevokeReport = (token, bema) => {
	return fetch(`/api/bema/pnyx-prime/item/${bema}/report`, {
		method: 'PATCH',
		body: JSON.stringify({ reason: false }),
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}

const PostAct = props => {
	const [persona, setPersona] = useState({ auth: false })
	const [lovers, setLovers] = useState(props.lovers)
	const [haters, setHaters] = useState(props.haters)
	const [reporters, setReporters] = useState(props.reporters)
	const [funders, setFunders] = useState(props.funders)
	const [felt, setFelt] = useState(false)

	const dummy = () => {
		console.log('not ready')
	}

	let patchy = dummy

	let reportBema = dummy

	let revokeReport = dummy

	useEffect(() => {
		if (persona.auth) {
			patchy = feels => {
				openLenny()
				persona.auth
					.getIdToken(true)
					.then(idToken => {
						return patchFeels(idToken, props.bema.UID, feels)
					})
					.then(response => handleResponse(response))
					.then(result => {
						switch (feels) {
							case 'loved': {
								const loving = lovers.filter(
									(value, index, arr) => {
										return value !== persona.auth.uid
									}
								)
								setHaters(
									haters.filter((value, index, arr) => {
										return value !== persona.auth.uid
									})
								)
								loving.push(persona.auth.uid)
								setLovers(loving)
								break
							}
							default: {
								const hating = haters.filter(
									(value, index, arr) => {
										return value !== persona.auth.uid
									}
								)
								setLovers(
									lovers.filter((value, index, arr) => {
										return value !== persona.auth.uid
									})
								)
								hating.push(persona.auth.uid)
								setHaters(hating)
								break
							}
						}
						closeLenny()
						return
					})
					.catch(err => {
						closeLenny()
						error.standard(err.message)
					})
			}

			reportBema = () => {
				const reason = prompt('Please enter your reason for reporting')
				if (!reason || reason.length < 10) {
					alert(
						'you must provide more of a reason when entering a report'
					)
					return
				}
				openLenny()
				persona.auth
					.getIdToken(true)
					.then(idToken => {
						return patchReport(idToken, props.bema.UID, {
							reason: reason,
						})
					})
					.then(response => handleResponse(response))
					.then(result => {
						const reporting = reporters.filter(
							(value, index, arr) => {
								return value !== persona.auth.uid
							}
						)
						reporting.push(persona.auth.uid)
						setReporters(reporting)
						closeLenny()
						return
					})
					.catch(err => {
						closeLenny()
						error.standard(err.message)
					})
			}
			revokeReport = () => {
				openLenny()
				persona.auth
					.getIdToken(true)
					.then(idToken => {
						return patchRevokeReport(idToken, props.bema.UID)
					})
					.then(response => handleResponse(response))
					.then(result => {
						const reporting = reporters.filter(
							(value, index, arr) => {
								return value !== persona.auth.uid
							}
						)
						setReporters(reporting)
						closeLenny()
						return
					})
					.catch(err => {
						closeLenny()
						error.standard(err.message)
					})
			}
		}
	})

	return (
		<PersonaConsumer>
			{personaIn => {
				setPersona(personaIn)

				const isOP = personaIn.auth.uid === props.bema.postedByUID

				return (
					<span className="pnyxActions">
						{isOP ? (
							''
						) : (
							<span
								className={`pnyxVote ${
									reporters.find(
										uid => uid === persona.auth.uid
									)
										? 'active'
										: 'inactive'
								}`}
								title="report"
								onClick={() => {
									reporters.find(
										uid => uid === persona.auth.uid
									)
										? revokeReport()
										: reportBema()
								}}
							>
								🙋
							</span>
						)}
						{isOP ? (
							<span
								className={`pnyxVote counted-action active`}
								title="hate this"
								onClick={() => {}}
							>
								💩
								<span className="counted">
									{props.hated > 0
										? `${formatCount(props.hated)}`
										: ''}
								</span>
							</span>
						) : (
							<span
								className={`pnyxVote counted-action ${
									haters.find(uid => uid === persona.auth.uid)
										? 'active'
										: 'inactive'
								}`}
								title="hate this"
								onClick={() => patchy('hated')}
							>
								💩
								<span className="counted">
									{props.hated > 0
										? `${formatCount(props.hated)}`
										: ''}
								</span>
							</span>
						)}
						{isOP ? (
							<span
								className={`pnyxVote counted-action active`}
								title="love this"
								onClick={() => {}}
							>
								❤️
								<span className="counted">
									{props.loved > 0
										? `${formatCount(props.loved)}`
										: ''}
								</span>
							</span>
						) : (
							<span
								className={`pnyxVote counted-action ${
									lovers.find(uid => uid === persona.auth.uid)
										? 'active'
										: 'inactive'
								}`}
								title="love this"
								onClick={() => patchy('loved')}
							>
								❤️
								<span className="counted">
									{props.loved > 0
										? `${formatCount(props.loved)}`
										: ''}
								</span>
							</span>
						)}
						{isOP ? (
							''
						) : (
							<span
								className={`pnyxVote ${
									funders.find(
										uid => uid === persona.auth.uid
									)
										? 'active'
										: 'inactive'
								}`}
								title="fund"
							>
								💵
							</span>
						)}
						<style jsx>{`
							span.pnyxVote {
								margin: 0 0.25em 0.25em 0;
							}
							.pnyxActions {
								display: flex;
								flex-direction: row;
							}
							span {
								cursor: ${isOP ? 'default' : 'pointer'};
								display: flex;
								align-items: flex-end;
							}

							span.inactive {
								filter: grayscale(100%);
							}
							span.active {
								filter: none;
							}

							.counted {
								margin: 0.25em 0.25em;
								padding-bottom: 0.5em;
								font-size: 11px;
							}
							.counted-action {
								display: flex;
								align-items: flex-end;
							}
						`}</style>
					</span>
				)
			}}
		</PersonaConsumer>
	)
}
export default PostAct
