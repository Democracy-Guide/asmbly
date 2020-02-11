import React, { useState, useEffect, useReducer } from 'react'
import firebase from '../../external/firebase'
import { openLenny, closeLenny } from '../../components/layout/modal-lenny'
import * as error from '../../common/error'

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

const AUTH_STATES = {
	auth: 'AUTH',
	claims: 'CLAIMS',
	persona: 'PERSONA',
	timedout: 'TIMEDOUT',
}

const authReducer = (state, action) => {
	switch (action.type) {
		case AUTH_STATES.auth:
			console.log(
				'auth',
				JSON.stringify(action.payload),
				new Date().getTime()
			)
			state.auth.user = action.payload
			return state
		case AUTH_STATES.claims:
			console.log(
				'claims',
				JSON.stringify(action.payload),
				new Date().getTime()
			)
			state.auth.claims = action.payload.claims
			state.auth.token = action.payload.token
			return state
		case AUTH_STATES.persona:
			console.log(
				'persona',
				JSON.stringify(action.payload),
				new Date().getTime()
			)
			state.auth.persona = action.payload
			return state
		case AUTH_STATES.timedout:
			console.log(
				'timedout',
				JSON.stringify(action.payload),
				new Date().getTime()
			)
			state.timedout = true
			return state
		default:
			throw new Error('bad action in auth reducer')
	}
}

const initialState = {
	timedout: false,
	auth: { user: false, token: false, claims: false, persona: false },
}

const useAuth = ({ reducer = (s, a) => a.changes } = {}) => {
	const [state, dispatch] = React.useReducer((state, action) => {
		const changes = authReducer(state, action)
		return reducer(state, { ...action, changes })
	}, initialState)

	const authenticated = user =>
		dispatch({ type: AUTH_STATES.auth, payload: user })
	const claims = (claims, token) =>
		dispatch({
			type: AUTH_STATES.claims,
			payload: { claims: claims, token: token },
		})
	const persona = persona =>
		dispatch({ type: AUTH_STATES.persona, payload: persona })
	const timedout = () => dispatch({ type: AUTH_STATES.timedout })

	return { state, authenticated, claims, persona, timedout }
}

export default useAuth
