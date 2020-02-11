import React from 'react'
import ReactDOM from 'react-dom'
import PostListItem from '../post-list-item'

const PnyxList = props => {
	const bemaList = props.bemas
		? props.bemas.map(bema => {
				return (
					<PostListItem
						key={bema.UID}
						post={bema}
						onComment={props.onComment}
					/>
				)
		  })
		: []
	return (
		<span className="innerPnyxContainer">
			{bemaList}
			<style jsx>{`
				.innerPnyxContainer {
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: stretch;
					width: 100%;
					padding-left: 1em;
				}
			`}</style>
		</span>
	)
}

export default PnyxList
