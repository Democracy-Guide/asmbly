import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { PersonaConsumer } from '../../../hooks/context/persona'
import * as error from '../../../common/error'
import { openLenny, closeLenny } from '../../layout/modal-lenny'
import MessagePost from '../../entry/message-post'

const patchModerate = (token, bema, action) => {
	return fetch(`/api/bema/pnyx-prime/item/${bema}/moderate/${action}`, {
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

const PostModerate = props => {
	const [persona, setPersona] = useState({ user: false })
	const [pinned, setPinned] = useState(props.pinned)
	const [locked, setLocked] = useState(props.locked)
	const [hidden, setHidden] = useState(props.hidden)
	const [prohibited, setProhibited] = useState(props.prohibited)

	const [action, setAction] = useState(false)

	const moderate = action => {
		openLenny()
		persona.auth
			.getIdToken(true)
			.then(idToken => {
				return patchModerate(idToken, props.bema, action)
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
				return (
					<span>
						<MessagePost />
						<span className="rowSpaceBetween">
							<span className="pnyxModActions">
								<span
									className={`pnyxVote ${
										pinned ? 'active' : 'inactive'
									}`}
									title="pin"
									onClick={() => props.action('message')}
								>
									💬
								</span>
								<span
									className={`pnyxVote ${
										pinned ? 'active' : 'inactive'
									}`}
									title="pin"
									onClick={() => props.action('pinned')}
								>
									📍
								</span>
								<span
									className={`pnyxVote ${
										locked ? 'active' : 'inactive'
									}`}
									title="lock"
									onClick={() => props.action('locked')}
								>
									🔒
								</span>
								<span
									className={`pnyxVote ${
										hidden ? 'active' : 'inactive'
									}`}
									title="hide"
									onClick={() => props.action('hidden')}
								>
									🙈
								</span>
								<span
									className={`pnyxVote ${
										prohibited ? 'active' : 'inactive'
									}`}
									title="prohibited"
									onClick={() => props.action('prohibited')}
								>
									🙅
								</span>

								<style jsx>{`
									span {
										margin: 0.25em 0.25em;
										cursor: pointer;
									}
									span.inactive {
										filter: grayscale(100%);
									}
									span.active {
										filter: none;
									}
								`}</style>
							</span>
						</span>
					</span>
				)
			}}
		</PersonaConsumer>
	)
}

export default PostModerate
