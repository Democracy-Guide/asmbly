import React, { useState } from 'react'
import emojis from '../../../lib/emoji.json'
import Emoji from '../emoji'
export default props => {
	const [selectedType, setSelectedType] = useState('smiled')
	const displayEmojiBar = props.hidden ? 'none' : 'flex'

	const emojiTypes = {}

	emojiTypes['smiled'] = emojis.filter(emoji => emoji.order <= 160)
	emojiTypes['people'] = emojis.filter(
		emoji => emoji.order > 160 && emoji.order <= 2372
	)
	emojiTypes['animals-plants'] = emojis.filter(
		emoji => emoji.order > 2372 && emoji.order <= 2637
	)
	emojiTypes['places'] = emojis.filter(
		emoji => emoji.order > 2637 && emoji.order <= 2896
	)
	emojiTypes['activity'] = emojis.filter(
		emoji => emoji.order > 2896 && emoji.order <= 2986
	)
	emojiTypes['possessions'] = emojis.filter(
		emoji => emoji.order > 2986 && emoji.order <= 3103
	)
	emojiTypes['home-office'] = emojis.filter(
		emoji => emoji.order > 3103 && emoji.order <= 3269
	)
	emojiTypes['signs'] = emojis.filter(
		emoji => emoji.order > 3269 && emoji.order <= 3445
	)

	const emojiMenuItems = [
		{ index: 0, name: 'smiled' },
		{ index: 65, name: 'people' },
		{ index: 68, name: 'animals-plants' },
		{ index: 0, name: 'places' },
		{ index: 19, name: 'activity' },
		{ index: 19, name: 'possessions' },
		{ index: 45, name: 'home-office' },
		{ index: 17, name: 'signs' },
	]

	return (
		<div className="emoji-bar">
			<div className="emoji-menu">
				{emojiMenuItems.map(menuItem => {
					return (
						<Emoji
							face={emojiTypes[menuItem.name][menuItem.index]}
							skin={props.skin}
							onClick={() => setSelectedType(menuItem.name)}
						/>
					)
				})}
			</div>
			<hr />
			<div className="emoji-set">
				{emojiTypes[selectedType].map(emoji => {
					return (
						<Emoji
							face={emoji}
							skin={props.skin}
							onClick={props.selectEmoji}
						/>
					)
				})}
			</div>
			<style jsx>{`
				.emoji-bar {
					display: ${displayEmojiBar};
					justify-content: flex-start;
					align-items: flex-start;
				}
				.emoji-bar hr {
					border-right: 1px solid #6464ab;
				}
				.emoji-menu {
					display: flex;
					flex-direction: column;
					margin: 0 16px;
					justify-content: center;
				}
				.emoji-set {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-wrap: wrap;
					flex-grow: 1;
					max-height: 23em;
					overflow-x: auto;
				}
			`}</style>
		</div>
	)
}
