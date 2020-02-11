import React from 'react'
import ReactDOM from 'react-dom'
import Emoji from '../../emojis/emoji'
import emojis from '../../../lib/emoji-map.json'
import { formatDate } from '../../../lib/format.js'

const PostSummary = props => (
	<summary>
		<div className="pnyxPostSummary">
			<Emoji face={emojis[props.face]} skin={props.skin} />
			<div className="pnyxPostHead">
				<span className="pnyxPostTitleAuthor">
					<span>{props.title}</span>
					<span className="smalltext">by {props.author}</span>
				</span>
				<span className="pnyxPostDate">
					<span>&nbsp;</span>
					<span className="smalltext">{formatDate(props.date)}</span>
				</span>
			</div>
		</div>
		{props.children}
		<style jsx>{`
			summary {
				margin: bottom;
				display: flex;
				flex-direction: column;
			}
			.pnyxPostHead {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-start;
				margin: 0;
				width: 100%;
			}
			.pnyxPostSummary {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				border-bottom: 1px solid #ebebeb;
				padding-bottom: 0.25em;
			}

			.pnyxPostTitleAuthor {
				display: flex;
				flex-direction: column;
				margin: auto 0 0 0;
			}
			.pnyxPostDate {
				display: flex;
				flex-direction: column;
				margin: auto 0 0 0;
			}
			summary::-webkit-details-marker {
				display: none;
			}
			.pnyxPostSummary {
				margin-bottom: 0.25em;
			}
		`}</style>
	</summary>
)

export default PostSummary
