import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useParams } from 'react-router-dom'
import FullTextInput from '../full-text-input'
import MultilineTextarea from '../multiline-textarea'
import Bema from '../bema'
import { openLenny, closeLenny } from '../../layout/modal-lenny'
import EmojiSkin from '../../emojis/emoji-skin'
import EmojiBar from '../../emojis/emoji-bar'
import Emoji from '../../emojis/emoji'
import emojis from '../../../lib/emoji-map.json'
import * as error from '../../../common/error'
import { PersonaConsumer } from '../../../hooks/context/persona'

const postBema = (token, bema, pnyxIn = false, host = false, guest = false) => {
	const pnyx = host ? `persona-${host}-${guest}` : pnyxIn
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

const PnyxPost = props => {
	const [contention, setContention] = useState('')
	const [speech, setSpeech] = useState('')
	const { personaName, pnyx } = useParams()

	const [authentic, setAuthentic] = useState(false)
	const [skin, setSkin] = useState(false)
	const [face, setFace] = useState(emojis['1F937'])
	const [chooser, showChooser] = useState(false)

	const displayToner = face.skins ? 'flex' : 'none'
	const displayEmojiBar = chooser ? undefined : 'true'

	const pnyxPath = props.host ? `persona-${props.host}-${props.guest}` : pnyx

	console.log('pnyx-post', pnyxPath)

	const postToPnyx = () => {
		openLenny()
		props.refreshPnyx(false)
		const bema = {
			pnyx: pnyxPath,
			stamp: `${authentic.auth.uid}-${Date.now()}`,
			postedBy: authentic.auth.displayName,
			postedTime: Date.now(),
			sorty: 899856000 - Date.now(),
			contention: contention,
			speech: speech,
			face: face.hexcode,
			skin: skin,
		}
		return authentic.auth
			.getIdToken(true)
			.then(idToken => {
				return postBema(
					idToken,
					bema,
					pnyxPath,
					props.host,
					props.guest
				)
			})
			.then(response => handleResponse(response))
			.then(result => {
				setContention('')
				setSpeech('')
				closeLenny()
				return props.refreshPnyx(true)
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
						<summary>Say something...</summary>
						<Bema refreshPnyx={props.refreshPnyx} pnyx={pnyxPath} />
						<style jsx>{`
							.ready {
								display: flex;
								flex-direction: column;
								justify-content: flex-start;
								align-items: stretch;
								flex-grow: 1;
								min-width: 21.75em;
								max-width: 90%;
								margin: 1em auto;
								padding: 0;
							}
							.ready summary {
								max-width: 90%;
								min-width: 21.25em;
							}
							.gone {
								display: none;
							}
							summary,
							details {
								border-radius: 4px;
							}
							summary::-webkit-details-marker {
								display: none;
							}
							summary:before {
								content: '📣';
								padding: 0 1em 0 0;
							}
						`}</style>
					</details>
				)
			}}
		</PersonaConsumer>
	)
}

export default PnyxPost
