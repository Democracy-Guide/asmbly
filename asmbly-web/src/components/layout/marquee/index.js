import React from 'react'
import ReactDOM from 'react-dom'

const Marquee = props => (
	<div className="marquee">
		<div className="flow">
			{props.messages.map((message, i) => {
				return (
					<div className="spaced" key={i}>
						{message}
					</div>
				)
			})}
		</div>
		<style jsx global>{`
			.marquee {
				height: 3em;
				overflow: hidden;
				white-space: nowrap;
				margin: 1em auto;
				max-width: 30em;
				min-width: 22em;
			}
			.marquee > div {
				-webkit-animation: marquee 90s infinite linear;
				animation: marquee 90s infinite linear;
			}
			.flow {
				width: 300em;
				display: flex;
				margin: 0;
				justify-content: space-between;
			}
			.spaced {
				width: 30em;
				margin-right: 30em;
			}
			@keyframes marquee {
				0% {
					transform: translate3d(30em, 0, 0);
				}

				100% {
					transform: translate3d(-300em, 0, 0);
				}
			}
			@keyframes marquee {
				0% {
					transform: translate3d(30em, 0, 0);
				}

				100% {
					transform: translate3d(-300em, 0, 0);
				}
			}
		`}</style>
	</div>
)

export default Marquee
