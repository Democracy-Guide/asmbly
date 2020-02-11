import React from 'react'
import ReactDOM from 'react-dom'

const LoadingLenny = () => (
	<div className={`lenny loadingLenny`}>
		<span>( ͡° ͜ʖ ͡°)</span>
		<style jsx global>{`
			@keyframes lennyAnim {
				0% {
					transform: translateZ(0);
					transform-origin: center;
					transform: scale(1);
				}

				50% {
					transform: translateZ(0);
					transform-origin: center;
					transform: scale(0.75);
				}

				100% {
					transform: translateZ(0);
					transform-origin: center;
					transform: scale(1);
				}
			}
			@-webkit-keyframes lennyAnim {
				0% {
					-webkit-transform: translateZ(0);
					-webkit-transform-origin: center;
					-webkit-transform: scale(1);
				}

				50% {
					-webkit-transform: translateZ(0);
					-webkit-transform-origin: center;
					-webkit-transform: scale(0.75);
				}

				100% {
					-webkit-transform: translateZ(0);
					-webkit-transform-origin: center;
					-webkit-transform: scale(1);
				}
			}
			.lenny {
				font-family: apple color emoji, segoe ui emoji, segoe ui symbol,
					Roboto, helvetica neue, Arial, sans-serif;
				margin: 0.23em 0;
			}
			.loadingLenny {
				-webkit-animation: lennyAnim 1.5s infinite ease;
				animation: lennyAnim 1.5s infinite ease;
				margin: 1em auto;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
			}
			.loadingLenny span {
				text-align: center;
				width: auto;
				max-width: 45px;
			}
		`}</style>
	</div>
)

export default LoadingLenny
