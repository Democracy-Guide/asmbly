import React from 'react'
import ReactDOM from 'react-dom'
import emojis from '../../../lib/emoji-map.json'
import Emoji from '../../emojis/emoji'

const HiddenDetails = props => {
	return props.on ? (
		<details>
			<summary>
				<Emoji face={emojis['1F648']} />
				<em>{`this post has been hidden ${props.reason}`}</em>
			</summary>
			{props.children}
			<style jsx>{`
				summary::-webkit-details-marker {
					display: none;
				}
				summary {
					display: flex;
					justify-content: flex-start;
					align-items: center;
				}
				details {
					border: solid 1px #ebebeb;
					border-radius: 4px;
					margin: 0 0.25em;
				}
			`}</style>
		</details>
	) : (
		<div>{props.children}</div>
	)
}

export default HiddenDetails
