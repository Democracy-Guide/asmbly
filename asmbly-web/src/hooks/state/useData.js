import React, { useState, useEffect } from 'react'
import { openLenny, closeLenny } from '../../components/layout/modal-lenny'
import * as error from '../../common/error'

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

export default (
	apiCall,
	persona,
	allowed,
	timedout,
	params,
	complete = false,
	timeout = false,
	defaultData = []
) => {
	const [data, setData] = useState(defaultData)
	const [procced, setProcced] = useState(false)

	useEffect(() => {
		if (allowed && persona.auth && procced === false) {
			setProcced(true)
			openLenny()
			persona.auth
				.getIdToken(true)
				.then(idToken => {
					if (params) {
						return apiCall(idToken, ...params)
					} else {
						return apiCall(idToken)
					}
				})
				.then(response => handleResponse(response))
				.then(result => {
					closeLenny()
					setData(result)
					if (complete) {
						complete(result)
					}
				})
				.catch(err => {
					closeLenny()
					error.standard(err.message)
				})
		} else if (timedout && allowed === false) {
			closeLenny()
			timeout()
		}
	}, [apiCall, persona, allowed, timedout, params, procced])

	return data
}
