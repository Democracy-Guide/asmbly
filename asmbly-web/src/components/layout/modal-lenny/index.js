import React from 'react'

import LoadingLenny from '../loading-lenny'

const closeLenny = () => {
	const container = document.getElementById('container')
	/* istanbul ignore else */
	if (container) {
		container.classList.remove('blurred-lenny')

		const lennyForm = document.getElementById('lenny-form')
		lennyForm.classList.add('lenny-form-off')
		lennyForm.classList.remove('lenny-form-on')

		const lenny = document.getElementById('lenny')
		lenny.classList.add('lenny-off')
		lenny.classList.remove('lenny-on')
	}
}

const openLenny = () => {
	const container = document.getElementById('container')
	/* istanbul ignore else */
	if (container) {
		container.classList.add('blurred-lenny')

		const lenny = document.getElementById('lenny')
		lenny.classList.remove('lenny-off')
		lenny.classList.add('lenny-on')

		const lennyForm = document.getElementById('lenny-form')
		lennyForm.classList.remove('lenny-form-off')
		lennyForm.classList.add('lenny-form-on')
	}
}

export { closeLenny, openLenny }

const LennyContent = props => {
	const scrollTop = document.documentElement.scrollTop
		? document.documentElement.scrollTop
		: 0
	return (
		<div className="hide-lenny">
			<div
				id="lenny"
				className={`lenny-${props.on ? 'on' : 'off'}`}
				data-testid="lenny-close"
			/>
			<div
				id="lenny-form"
				className={`lenny-form-${props.on ? 'on' : 'off'}`}
				data-testid="lenny-form"
			>
				<span>working</span>
				<LoadingLenny />
			</div>
			<style jsx="true" global="true">
				{`
					.lenny-on {
						background-color: rgb(251, 251, 248, 0.5);
						display: flex;
						flex-direction: column;
						visibility: visible;
						position: fixed;
						top: 0;
						left: 0;
						height: 100%;
						width: 100%;
						backdrop-filter: opacity(95%) blur(5px);
					}
					.lenny-off {
						visibility: hidden;
					}
					.lenny-gone {
						display: none;
					}
					.lenny-form-on {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: stretch;
						visibility: visible;
						position: fixed;
						left: 50%;
						top: ${parseInt(scrollTop) + 370}px;
						transform: translate(-50%, -50%);
						height: fit-content;
						width: 100%;
						min-width: 21.75em;
						max-width: 45em;
						overflow-y: auto;
						overflow-x: hidden;
						border-radius: 3px;
						padding: 2.5em;
					}

					.lenny-form-off {
						visibility: hidden;
					}

					.lenny-form-gone {
						display: none;
					}

					.hide-lenny {
						height: 0;
						overflow: hidden;
					}
				`}
			</style>
		</div>
	)
}

export default LennyContent
