import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import FullTextInput from '../full-text-input'
import MultilineTextarea from '../multiline-textarea'
import { openLenny, closeLenny } from '../../layout/modal-lenny'
import { closeModal } from '../../layout/modal-content'
import EmojiSkin from '../../emojis/emoji-skin'
import EmojiBar from '../../emojis/emoji-bar'
import Emoji from '../../emojis/emoji'
import emojis from '../../../lib/emoji-map.json'
import * as error from '../../../common/error'
import { PersonaConsumer } from '../../../hooks/context/persona'

const postBema = (token, bema, pnyx) => {
	return fetch(`/api/bema/${pnyx}/item`, {
		method: 'POST',
		body: JSON.stringify(bema),
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

const Bema = props => {
	const [contention, setContention] = useState('')
	const [speech, setSpeech] = useState('')

	const [authentic, setAuthentic] = useState(false)
	const [skin, setSkin] = useState(false)
	const [face, setFace] = useState(emojis['1F937'])
	const [chooser, showChooser] = useState(false)

	const displayToner = face.skins ? 'flex' : 'none'
	const displayEmojiBar = chooser ? undefined : 'true'
	console.log('bema', props.pnyx)

	useEffect(() => {
		if (authentic) {
			setFace(emojis[authentic.persona.face])
			setSkin(authentic.persona.skin)
		}
	}, [authentic])

	const postToPnyx = () => {
		openLenny()
		props.refreshPnyx(false)
		const bema = {
			pnyx: props.pnyx,
			stamp: `${authentic.auth.uid}-${Date.now()}`,
			postedBy: authentic.auth.displayName,
			postedByUID: authentic.auth.uid,
			postedTime: Date.now(),
			sorty: 899856000 - Date.now(),
			contention: contention,
			speech: speech,
			face: face.hexcode,
			skin: skin,
			parent: props.parent ? props.parent : '',
			ancestor: props.ancestor ? props.ancestor : '',
		}
		return authentic.auth
			.getIdToken(true)
			.then(idToken => {
				return postBema(idToken, bema, props.pnyx)
			})
			.then(response => handleResponse(response))
			.then(result => {
				closeModal()
				setContention('')
				setSpeech('')
				closeLenny()
				return props.refreshPnyx(result.parent ? result.parent : true)
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
	const parentId = props.parent ? `-${props.parent}` : ''
	return (
		<PersonaConsumer>
			{persona => {
				setAuthentic(persona)
				return (
					<div className="bema">
						<div className="bema-box">
							<Emoji
								face={face}
								skin={skin}
								onClick={chooseEmoji}
							/>
							<FullTextInput
								id={`contention${parentId}`}
								label="What do you want to discuss?"
								value={contention}
								setVal={incoming => {
									setContention(incoming)
								}}
								maxlength="144"
							/>
						</div>
						<MultilineTextarea
							id={`speech${parentId}`}
							label="What do you have to say about it?"
							setVal={incoming => {
								setSpeech(incoming)
							}}
							rows="6"
							required
							value={speech}
						/>
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
									value="post to pnyx"
									onClick={postToPnyx}
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
							.bema div {
								margin: 0.25em auto;
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
							.bema .pnyx-emoji-container,
							.bema .bema-box,
							.bema .column {
								min-width: 21.75em;
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
						`}</style>
					</div>
				)
			}}
		</PersonaConsumer>
	)
}

export default Bema
