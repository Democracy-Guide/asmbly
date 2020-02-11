import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import MessagePost from '../../entry/message-post'
import PostDetails from '../post-details'
import PostModerate from '../post-moderate'
import HiddenDetails from '../../layout/hidden-details'
import { PersonaConsumer } from '../../../hooks/context/persona'
import { formatDate } from '../../../lib/format.js'

const PostListItem = props => {
	const [persona, setPersona] = useState({ auth: false })

	return (
		<PersonaConsumer>
			{personaIn => {
				setPersona(personaIn)
				return (
					<div className="pnyxContent">
						<HiddenDetails
							on={
								props.post.hidden
									? props.post.hidden
									: props.post.reported > 0
							}
							reason={
								props.post.hidden
									? ' by moderators and may be offensive'
									: props.post.reported > 0
									? ' while reports are being reviewed'
									: ' no reason'
							}
						>
							<PostDetails
								post={props.post}
								onComment={props.onComment}
								refresh={props.refresh}
							/>
						</HiddenDetails>

						<style jsx global>{`
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
							.reportList {
								border-bottom: solid #ebebeb 0.5px;
								display: flex;
								padding-bottom: 0.5em;
							}
							.pnyxContent {
								padding-bottom: 0.25em;
								border-bottom: 1px solid #ebebeb;
								border-left: 1px solid #ebebeb;
								border-radius: 0 4px;
								margin: 0 0 0.125em 0;
								text-align: start;
							}
						`}</style>
					</div>
				)
			}}
		</PersonaConsumer>
	)
}

export default PostListItem
