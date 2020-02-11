import React from 'react'
export default props => {
	const selectEmoji = e => {
		props.onClick(props.face)
	}
	const emojiSize = props.size ? props.size : 'xx-large'
	return (
		<span
			className="emoji"
			title={props.face.annotation}
			onClick={selectEmoji}
			aria-label={props.face.annotation}
		>
			{props.face.skins
				? props.skin
					? String.fromCodePoint(
							parseInt(props.face.hexcode, 16),
							parseInt(props.skin, 16)
					  )
					: String.fromCodePoint(parseInt(props.face.hexcode, 16))
				: String.fromCodePoint(parseInt(props.face.hexcode, 16))}
			<style jsx>{`
				.emoji {
					font-size: ${emojiSize};
					margin: 0.25em 0.5em 0.25em 0.25em;
					cursor: pointer;
				}
			`}</style>
		</span>
	)
}
