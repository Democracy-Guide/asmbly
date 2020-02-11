import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import PostSummary from '../post-summary'
import PostListItemReport from '../post-list-item-report'
import PostAct from '../post-act'
import PostModerated from '../post-moderated'
import PnyxList from '../pnyx-list'
import ReactMarkdown from 'react-markdown'
import * as error from '../../../common/error'
import useData from '../../../hooks/state/useData'
import { PersonaConsumer } from '../../../hooks/context/persona'
import { RefreshingConsumer } from '../../../hooks/context/refreshing'
import { openLenny, closeLenny } from '../../layout/modal-lenny'
import Bouncer from '../../layout/bouncer'

const initObserver = (callback, key) => {
	const container = document.getElementById(`pnyxPost-${key}`)
	const observer = new MutationObserver(callback)
	const config = {
		attributes: true,
		attributeOldValue: true,
		attributeFilter: ['open'],
	}
	observer.observe(container, config)
	return () => {
		observer.disconnect()
	}
}

const findChildren = (token, key, pnyx) => {
	return fetch(`/api/bema/${pnyx}/item/${key}/children`, {
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

const canPersonaAct = (displayName, postedBy, locked) => {
	return displayName !== postedBy && !locked
}

const PostDetails = props => {
	const [closed, setClosed] = useState(true)
	const [allowed, setAllowed] = useState(false)
	const [persona, setPersona] = useState(false)
	const [refresh, setRefresh] = useState({
		refresh: true,
		UID: props.post.UID,
	})
	const [children, setChildren] = useState([])

	const observation = mutationRecord => {
		if (mutationRecord.length > 0 && mutationRecord[0].target.open) {
			setClosed(false)
		} else {
			setClosed(true)
		}
	}

	useEffect(() => {
		return initObserver(observation, props.post.UID)
	}, [])

	useEffect(() => {
		const relevant = refresh.UID === props.post.UID || refresh.UID === ''
		const commented = props.post.children > 0
		if (allowed & !closed && relevant && commented) {
			openLenny()
			persona.auth
				.getIdToken(true)
				.then(idToken => {
					return findChildren(
						idToken,
						props.post.UID,
						props.post.pnyx
					)
				})
				.then(response => handleResponse(response))
				.then(result => {
					closeLenny()
					setChildren(result)
				})
				.catch(err => {
					closeLenny()
					error.standard(err.message)
				})
		}
	}, [allowed, closed, persona.auth, props.post, refresh])

	return (
		<PersonaConsumer>
			{personaIn => {
				setPersona(personaIn)
				return (
					<RefreshingConsumer>
						{refreshingIn => {
							console.log('refreshing comments', refreshingIn)
							setRefresh(refreshingIn)
							return (
								<details
									id={`pnyxPost-${props.post.UID}`}
									className="pnyxPost"
									open={
										props.post.children > 0 ? false : true
									}
								>
									<PostSummary
										title={props.post.contention}
										author={props.post.postedBy}
										date={props.post.postedTime}
										face={props.post.face}
										skin={props.post.skin}
									>
										<span className="rowSpaceBetween">
											<PostModerated
												bema={props.post}
												pinned={props.post.pinned}
												locked={props.post.locked}
												hidden={props.post.hidden}
												prohibited={
													props.post.prohibited
												}
												onComment={props.onComment}
											/>
											{props.post.locked ? (
												<div />
											) : (
												<PostAct
													bema={props.post}
													funders={props.post.funders}
													lovers={props.post.lovers}
													loved={props.post.loved}
													haters={props.post.haters}
													hated={props.post.hated}
													reporters={
														props.post.reporters
													}
												/>
											)}
										</span>
										{props.post.reportsFiled ? (
											<span className="reportList">
												{props.post.reportsFiled.map(
													report => (
														<PostListItemReport
															report={report}
														/>
													)
												)}
											</span>
										) : (
											<span />
										)}
									</PostSummary>
									<div className="markdown-container">
										<ReactMarkdown
											source={props.post.speech}
											disallowedTypes={[
												'link',
												'image',
												'linkReference',
												'imageReference',
											]}
										/>
									</div>
									<PnyxList
										bemas={children}
										onComment={props.onComment}
									/>
									<Bouncer
										pnyx
										isAllowed={allow => {
											setAllowed(allow)
										}}
									/>
									<style jsx global>{`
										pre {
											white-space: pre-wrap;
										}
										details {
											width: 100%;
											padding: 0.25em 0 0.25em 0.33em;
										}
										.pnyxPost div {
											flex-grow: 1;
										}
										.markdown-container {
											margin: 0 0 0 1em;
											padding: 0 0 0 0.5em;

											border-bottom: 1px solid #f5f5f5;
											border-left: 1px solid #f5f5f5;
											border-radius: 0 4px;
										}
									`}</style>
								</details>
							)
						}}
					</RefreshingConsumer>
				)
			}}
		</PersonaConsumer>
	)
}
export default PostDetails
