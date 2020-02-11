import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'

import ModalLenny, {
	openLenny,
	closeLenny,
} from '../components/layout/modal-lenny'

import SignUp from './sign-up'
import Invite from './invite'
import VerifyRequest from './verify-request'
import Register from './register'
import PnyxPrime from './pnyx-prime'
import Persona from './persona'
import Messages from './messages'
import ReviewReports from './review-reports'
import ManagePersonas from './manage-personas'
import Proto from './proto'

import firebase, { authenticated } from '../external/firebase'
import * as error from '../common/error'
import { PersonaProvider } from '../hooks/context/persona'
import { RefreshingProvider } from '../hooks/context/refreshing'

const getAuthenticPersona = (token, uid) => {
	return fetch(`/api/persona/item/${uid}`, {
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

const App = () => {
	const [auth, setAuth] = useState(false)
	const [claims, setClaims] = useState(false)
	const [persona, setPersona] = useState(false)
	const [timedout, setTimedout] = useState(false)
	const [token, setToken] = useState(false)

	const changed = authentic => {
		if (authentic) {
			setAuth(authentic)
			authentic.getIdTokenResult().then(idToken => {
				setClaims(idToken.claims)
				setToken(idToken.token)
			})
		}
	}

	const getAuth = () => {
		openLenny()
		setTimeout(() => {
			console.log('time out')
			setTimedout(true)
		}, 1500)
		firebase.auth().onAuthStateChanged(changed)
	}

	useEffect(() => {
		if (token) {
			console.log(token)
			getAuthenticPersona(token, auth.uid)
				.then(response => {
					return handleResponse(response)
				})
				.then(personaIn => {
					setPersona({
						auth: auth,
						claims: claims,
						persona: personaIn,
						token: token,
					})
				})
				.catch(err => {
					error.standard(err.message)
				})
		}
	}, [token])

	const [bubblePnyx, refresh] = useState(true)
	useEffect(() => {
		console.log('refresh', bubblePnyx ? true : false)
		console.log('UID', bubblePnyx === true ? '' : bubblePnyx)
	}, [bubblePnyx])

	return (
		<Router>
			<RefreshingProvider
				value={{
					refresh: bubblePnyx ? true : false,
					UID: bubblePnyx === true ? '' : bubblePnyx,
				}}
			>
				<PersonaProvider value={persona}>
					<div className="modal-wrapper">
						<div id="container" className="contain">
							<Switch>
								<Route exact path="/pnyx/:pnyx/review-reports">
									<Header refreshPnyx={refresh} review />
								</Route>
								<Route path="/messages">
									<Header refreshPnyx={refresh} review />
								</Route>
								<Route exact path="/persona/:personaName">
									<Header refreshPnyx={refresh} pnyx />
								</Route>
								<Route exact path="/proto">
									<Header refreshPnyx={refresh} pnyx />
								</Route>
								<Route path="/pnyx/:pnyx">
									<Header refreshPnyx={refresh} pnyx />
								</Route>
								<Route component={Header} />
							</Switch>
							<Switch>
								<Route exact path="/invite">
									<Invite
										getAuth={getAuth}
										timedout={timedout}
									/>
								</Route>
								<Route exact path="/manage-personas">
									<ManagePersonas
										getAuth={getAuth}
										timedout={timedout}
									/>
								</Route>
								<Route exact path="/sign-up">
									<SignUp />
								</Route>
								<Route exact path="/verifyRequest">
									<VerifyRequest />
								</Route>
								<Route exact path="/proto">
									<Proto />
								</Route>
								<Route exact path="/pnyx/prime">
									<PnyxPrime
										refresher={refresh}
										getAuth={getAuth}
										timedout={timedout}
									/>
								</Route>
								<Route exact path="/messages">
									<Messages
										refresher={refresh}
										getAuth={getAuth}
										timedout={timedout}
									/>
								</Route>
								<Route exact path="/persona/:personaName">
									<Persona
										refresher={refresh}
										getAuth={getAuth}
										timedout={timedout}
									/>
								</Route>
								<Route exact path="/pnyx/prime/review-reports">
									<ReviewReports
										getAuth={getAuth}
										timedout={timedout}
									/>
								</Route>
								<Route exact path="/pnyx/prime/register">
									<Register />
								</Route>
							</Switch>
							<ModalLenny />
							<Footer />
						</div>
					</div>
				</PersonaProvider>
			</RefreshingProvider>
		</Router>
	)
}

export default App
