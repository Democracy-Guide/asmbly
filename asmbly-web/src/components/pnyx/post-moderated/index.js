import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { PersonaConsumer } from '../../../hooks/context/persona'
import { openLenny, closeLenny } from '../../layout/modal-lenny'
import * as error from '../../../common/error'
import { formatCount } from '../../../lib/format.js'

const patchModerate = (token, bema, action, reason) => {
	return fetch(`/api/bema/pnyx-prime/item/${bema}/moderate/${action}`, {
		method: 'PATCH',
		body: JSON.stringify({ reason: reason }),
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

const actions = {
	PINNED: 'pinned',
	LOCKED: 'locked',
	HIDDEN: 'hidden',
	PROHIBITED: 'prohibited',
	COMMENT: 'comment',
}

const PostModerated = props => {
	const [persona, setPersona] = useState({ user: false })
	const [commented, setCommented] = useState(
		props.commented ? props.commented : 0
	)
	const [pinned, setPinned] = useState(props.pinned)
	const [locked, setLocked] = useState(props.locked)
	const [hidden, setHidden] = useState(props.hidden)
	const [prohibited, setProhibited] = useState(props.prohibited)

	const moderate = action => {
		const reason = prompt(
			`Please enter your reason for toggling this post ${action}`
		)
		if (!reason || reason.length < 10) {
			alert('you must provide more of a reason when moderating a post')
			return
		}
		openLenny()
		persona.auth
			.getIdToken(true)
			.then(idToken => {
				return patchModerate(idToken, props.bema.UID, action, reason)
			})
			.then(response => handleResponse(response))
			.then(result => {
				closeLenny()
				setPinned(result.pinned)
				setLocked(result.locked)
				setHidden(result.hidden)
				setProhibited(result.prohibited)
			})
			.catch(err => {
				closeLenny()
				error.standard(err.message)
			})
	}

	return (
		<PersonaConsumer>
			{personaIn => {
				setPersona(personaIn)
				const isMod = personaIn.claims && personaIn.claims.moderator
				const clickAction = (event, action) => {
					event.preventDefault()
					if (isMod) {
						moderate(action)
					}
				}
				let cursor = 'default'
				if (isMod) {
					cursor = 'pointer'
				}
				return (
					<span className="pnyxModActions">
						{!locked ? (
							<span
								className={`pnyxVote universal counted-action ${
									props.bema.descendants > 0
										? 'active'
										: 'inactive'
								}`}
								title="comment"
								onClick={e => {
									e.preventDefault()
									props.onComment(props.bema)
								}}
							>
								💬
								<span className="counted">
									{props.bema.descendants > 0
										? `${formatCount(
												props.bema.descendants
										  )}`
										: ''}
								</span>
							</span>
						) : (
							''
						)}
						{pinned || isMod ? (
							<span
								className={`pnyxVote ${
									pinned ? 'active' : 'inactive'
								}`}
								title="pinned"
								onClick={e => clickAction(e, actions.PINNED)}
							>
								📍
							</span>
						) : (
							''
						)}
						{locked || isMod ? (
							<span
								className={`pnyxVote ${
									locked ? 'active' : 'inactive'
								}`}
								title="locked"
								onClick={e => clickAction(e, actions.LOCKED)}
							>
								🔒
							</span>
						) : (
							''
						)}
						{hidden || isMod ? (
							<span
								className={`pnyxVote ${
									hidden ? 'active' : 'inactive'
								}`}
								title="hidden"
								onClick={e => clickAction(e, actions.HIDDEN)}
							>
								🙈
							</span>
						) : (
							''
						)}
						{prohibited || isMod ? (
							<span
								className={`pnyxVote ${
									prohibited ? 'active' : 'inactive'
								}`}
								title="prohibited"
								onClick={e =>
									clickAction(e, actions.PROHIBITED)
								}
							>
								🙅
							</span>
						) : (
							''
						)}
						<style jsx>{`
							.pnyxModActions {
								display: flex;
								flex-direction: row;
							}
							span.pnyxVote {
								margin: 0 0.25em 0.25em 0;
							}
							span {
								cursor: ${cursor};
								display: flex;
								align-items: flex-end;
							}
							span.universal {
								cursor: pointer;
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

export default PostModerated
