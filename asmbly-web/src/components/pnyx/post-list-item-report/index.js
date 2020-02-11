import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { formatDate } from '../../../lib/format.js'
import * as error from '../../../common/error'
import { PersonaConsumer } from '../../../hooks/context/persona'

import { openLenny, closeLenny } from '../../layout/modal-lenny'

const patchReportClosure = (token, bema, report) => {
	return fetch(`/api/bema/pnyx-prime/item/${bema}/report/${report}/close`, {
		method: 'PATCH',
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
const PostListItemReport = props => {
	const [persona, setPersona] = useState({ auth: false })
	const closeReport = () => {
		openLenny()
		persona.auth
			.getIdToken(true)
			.then(idToken => {
				return patchReportClosure(
					idToken,
					props.report.reportedBema,
					props.report.UID
				)
			})
			.then(response => handleResponse(response))
			.then(result => {
				closeLenny()
				return
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
					<span className="reportContent">
						<span className="smalltext">{`${
							props.report.reportedBy
						} said:`}</span>
						<br />
						<span className="report">
							<span
								className="closer"
								onClick={() => closeReport()}
							>
								✔
							</span>
							{`${props.report.reportedFor}`}
						</span>
						<br />
						<span className="smalltext">
							{formatDate(props.report.reportedOn)}
						</span>{' '}
						<style jsx>{`
							.report: {
								display: flex;
							}
							.closer {
								margin-right: 0.5em;
								cursor: pointer;
							}
							.reportContent {
								margin-left: 3em;
								display: flex;
								flex-direction: column;
								justify-content: flex-start;
							}
							.reportContent .smalltext {
								margin-left: 2.5em;
							}
						`}</style>
					</span>
				)
			}}
		</PersonaConsumer>
	)
}

export default PostListItemReport
