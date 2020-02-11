import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import * as error from '../../common/error'
import { openLenny, closeLenny } from '../../components/layout/modal-lenny'
import Bouncer from '../../components/layout/bouncer'
import PostListItem from '../../components/pnyx/post-list-item'
import Authenticate from '../../components/authentication/authenticate-popup'
import AuthenticateEmail from '../../components/authentication/authenticate-email'

import { PersonaConsumer } from '../../hooks/context/persona'

import useAuth from '../../hooks/state/useAuth'
import useData from '../../hooks/state/useData'

const findBemas = token => {
	return fetch(`/api/report/pnyx-prime/open/list`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}

const ReviewReports = props => {
	const [section, setSection] = useState('email')
	const [email, setEmail] = useState(undefined)
	const [allowed, setAllowed] = useState(false)
	const [persona, setPersona] = useState(false)
	const [authPref, setAuthPref] = useState(false)

	const onTimeout = () => {
		setSection('email')
	}

	const onLoaded = bemasIn => {
		setSection('pnyx')
	}

	const bemas = useData(
		findBemas,
		persona,
		allowed,
		props.timedout,
		false,
		onLoaded,
		onTimeout,
		[]
	)

	useEffect(() => {
		props.getAuth()
	}, [])

	useEffect(() => {
		if (authPref) {
			closeLenny()
			setSection('login')
		}
	}, [authPref])

	const bemaList = bemas.map(bema => {
		return <PostListItem key={bema.UID} post={bema} />
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
							moderator
							isAllowed={allow => {
								setAllowed(allow)
							}}
						/>
						<style jsx global>{`
							.bemas {
								width: 90%;
							}
						`}</style>
					</div>
				)
			}}
		</PersonaConsumer>
	)
}

export default ReviewReports
