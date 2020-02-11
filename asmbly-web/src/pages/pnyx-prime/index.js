import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import * as error from '../../common/error'
import { openLenny, closeLenny } from '../../components/layout/modal-lenny'
import { openModal, closeModal } from '../../components/layout/modal-content'
import Bouncer from '../../components/layout/bouncer'
import PostListItem from '../../components/pnyx/post-list-item'
import CommentModal from '../../components/pnyx/comment-modal'
import Authenticate from '../../components/authentication/authenticate-popup'
import AuthenticateEmail from '../../components/authentication/authenticate-email'

import { PersonaConsumer } from '../../hooks/context/persona'
import { RefreshingConsumer } from '../../hooks/context/refreshing'

import useAuth from '../../hooks/state/useAuth'
import useData from '../../hooks/state/useData'

const findBemas = token => {
	return fetch(`/api/bema/pnyx-prime/list`, {
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

const INIT_COMMENT = { UID: '', contention: '', ancestor: '', parent: '' }

const PnyxPrime = props => {
	const [section, setSection] = useState('init')
	const [email, setEmail] = useState(undefined)
	const [allowed, setAllowed] = useState(false)
	const [persona, setPersona] = useState(false)
	const [authPref, setAuthPref] = useState(false)
	const [refresh, setRefresh] = useState(false)

	const [bemas, setBemas] = useState([])
	const [commentOn, setCommentOn] = useState(INIT_COMMENT)

	const onTimeout = () => {
		setSection('email')
	}

	const onLoaded = () => {
		setSection('pnyx')
	}

	const onComment = bema => {
		setCommentOn(bema)
	}

	useEffect(() => {
		if (allowed && refresh) {
			console.log('refreshing pnyx')
			openLenny()
			persona.auth
				.getIdToken(true)
				.then(idToken => {
					return findBemas(idToken)
				})
				.then(response => handleResponse(response))
				.then(result => {
					closeLenny()
					setBemas(result)
					onLoaded()
				})
				.catch(err => {
					closeLenny()
					error.standard(err.message)
				})
		} else if (props.timedout && allowed === false) {
			closeLenny()
			onTimeout()
		}
	}, [allowed, refresh, props.timedout])

	useEffect(() => {
		console.log('getting auth')
		props.getAuth()
	}, [])

	useEffect(() => {
		if (authPref) {
			closeLenny()
			setSection('login')
		}
	}, [authPref])

	useEffect(() => {
		if (commentOn.UID.length > 0) {
			openModal()
		}
	}, [commentOn.UID])

	const bemaList = bemas.map(bema => {
		return (
			<PostListItem
				key={bema.UID}
				post={bema}
				onComment={onComment}
				refresh={props.refresh}
			/>
		)
	})

	const message = {
		init: {
			lead: <div />,
			body: <div />,
		},
		email: {
			lead: 'Enter the email you registered with ASMBLY',
			body: (
				<AuthenticateEmail
					setAuthPref={setAuthPref}
					setAuthEmail={setEmail}
				/>
			),
		},
		login: {
			lead: 'Enter the Pnyx',
			body: <Authenticate authPref={authPref} email={email} />,
		},
		pnyx: {
			lead: <div />,
			body: <div className="bemas">{bemaList}</div>,
		},
	}

	return (
		<PersonaConsumer>
			{personaIn => {
				setPersona(personaIn)
				return (
					<RefreshingConsumer>
						{refreshingIn => {
							setRefresh(
								refreshingIn.refresh && refreshingIn.UID === ''
							)
							return (
								<div className="content">
									<div className="centered">
										==============================
									</div>
									<div className="centered pointed">
										{message[section].lead}
									</div>
									<div className="centered pointed">
										{message[section].body}
									</div>
									<div className="centered">
										==============================
									</div>
									<Bouncer
										pnyx
										isAllowed={allow => {
											setAllowed(allow)
										}}
									/>
									<CommentModal
										pnyx="pnyx-prime"
										parent={commentOn}
										ancestor={
											commentOn.ancestor
												? commentOn.ancestor
												: commentOn.UID
										}
										onClose={() =>
											setCommentOn(INIT_COMMENT)
										}
										refresher={props.refresher}
									/>
									<style jsx global>{`
										.bemas {
											width: 90%;
											display: flex;
											flex-direction: column;
											align-items: stretch;
											justify-content: start;
											margin: auto;
										}
									`}</style>
								</div>
							)
						}}
					</RefreshingConsumer>
				)
			}}
		</PersonaConsumer>
	)
}

export default PnyxPrime
