import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import FullTextInput from '../full-text-input'
import MultilineTextarea from '../multiline-textarea'
import { openLenny, closeLenny } from '../../layout/modal-lenny'
import EmojiSkin from '../../emojis/emoji-skin'
import EmojiBar from '../../emojis/emoji-bar'
import Emoji from '../../emojis/emoji'
import emojis from '../../../lib/emoji-map.json'
import * as error from '../../../common/error'
import { PersonaConsumer } from '../../../hooks/context/persona'

const postMessage = (token, message) => {
	return fetch(`/api/persona-message/item`, {
		method: 'POST',
		body: JSON.stringify(message),
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
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

const MessagePost = props => {
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')
	const [recipient, setRecipient] = useState('')
	const [sender, setSender] = useState('')

	const [authentic, setAuthentic] = useState(false)
	const [skin, setSkin] = useState(false)
	const [face, setFace] = useState(emojis['1F937'])
	const [chooser, showChooser] = useState(false)

	const displayToner = face.skins ? 'flex' : 'none'
	const displayEmojiBar = chooser ? undefined : 'true'

	const postToPersona = () => {
		openLenny()
		const message = {
			to: recipient,
			from: sender,
			postedTime: Date.now(),
			sorty: 899856000 - Date.now(),
			subject: subject,
			message: message,
			face: face.hexcode,
			skin: skin,
		}
		return authentic.auth
			.getIdToken(true)
			.then(idToken => {
				return postMessage(idToken, message)
			})
			.then(response => handleResponse(response))
			.then(result => {
				setSubject('')
				setMessage('')
				closeLenny()
				return props.refreshPnyx(result.UID)
			})
			.catch(err => {
				closeLenny()
				error.standard(err.message)
			})
	}

	const chooseEmoji = e => {
		showChooser(!chooser)
	}

	const selectEmoji = e => {
		setFace(e)
		showChooser(false)
	}
	return (
		<PersonaConsumer>
			{persona => {
				setAuthentic(persona)
				return (
					<details className={authentic ? 'ready' : 'gone'}>
						<summary>Response Message...</summary>
						<div className="bema">
							<div className="bema-box">
								<Emoji
									face={face}
									skin={skin}
									onClick={chooseEmoji}
								/>
								<FullTextInput
									id="subject"
									label="Subject"
									value={subject}
									setVal={incoming => {
										setSubject(incoming)
									}}
									maxlength="144"
								/>
							</div>
							<MultilineTextarea
								id="message"
								label="Message"
								setVal={incoming => {
									setMessage(incoming)
								}}
								rows="6"
								required
								value={message}
							/>
						</div>
						<div className="pnyx-emoji-container">
							<div className="pnyx-submit">
								<EmojiSkin
									setSkin={setSkin}
									displayToner={displayToner}
								/>
								<div>&nbsp;</div>
								<input
									className="pnyx-submit-click"
									type="submit"
									value="send to selected"
									onClick={postToPersona}
								/>
							</div>
							<div className="pnyx-emoji-scroller">
								<EmojiBar
									skin={skin}
									selectEmoji={selectEmoji}
									hidden={displayEmojiBar}
								/>
							</div>
						</div>
						<style jsx>{`
							.ready {
								display: flex;
								flex-direction: column;
								justify-content: flex-start;
								align-items: stretch;
								flex-grow: 1;
								margin: 1em 0;
							}
							.ready summary,
							.ready .bema,
							.ready .pnyx-emoji-container {
								max-width: 90%;
								min-width: 23em;
								margin: auto;
							}
							.gone {
								display: none;
							}
							.pnyx-submit {
								display: flex;
								flex-direction: row;
								justify-content: space-between;
								width: 100%;
							}
							.pnyx-submit-button {
								width: 8em;
								margin-left: auto;
							}
							.pnyx-post-container {
								display: flex;
								flex-direction: row;
								justify-content: space-between;
								min-width: 100%;
							}
							.bema {
								display: flex;
								flex-direction: column;
								justify-content: flex-start;
								align-items: stretch;
								flex-grow: 1;
								padding-top: 1em;
							}
							.pnyx-emoji-scroller {
								margin-top: 1em;
							}
							.pnyx-emoji-container {
								margin-top: 1em;
								width: 100%;
							}
							.bema-box {
								width: 100%;
								display: flex;
								align-items: center;
							}
							summary,
							details {
								border-radius: 4px;
							}
							summary::-webkit-details-marker {
								display: none;
							}
							summary:before {
								content: '🗣';
								padding: 0 1em 0 0;
							}
						`}</style>
					</details>
				)
			}}
		</PersonaConsumer>
	)
}

export default MessagePost
