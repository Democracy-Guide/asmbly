import React, { useEffect, useState } from 'react'

const closeModal = () => {
	document.documentElement.style.overflow = 'auto'
	const container = document.getElementById('container')
	container.classList.remove('blurred-content')

	const modalForm = document.getElementById('modal-form')
	modalForm.classList.add('modal-form-off')
	modalForm.classList.remove('modal-form-on')

	const modal = document.getElementById('modal')
	modal.classList.add('modal-off')
	modal.classList.remove('modal-on')
}

const openModal = () => {
	document.documentElement.style.overflow = 'hidden'
	const container = document.getElementById('container')
	container.classList.add('blurred-content')

	const modal = document.getElementById('modal')
	modal.classList.remove('modal-off')
	modal.classList.add('modal-on')

	const modalForm = document.getElementById('modal-form')
	modalForm.classList.remove('modal-form-off')
	modalForm.classList.add('modal-form-on')
}

export { closeModal, openModal }

const initObserver = callback => {
	const container = document.getElementById('container')
	const observer = new MutationObserver(callback)
	const config = {
		attributes: true,
		attributeOldValue: true,
		attributeFilter: ['class'],
	}
	observer.observe(container, config)
	return () => {
		observer.disconnect()
	}
}

const ModalContent = props => {
	const [closed, setClosed] = useState(true)
	const observation = mutationRecord => {
		if (
			(mutationRecord.length > 0) &
				!mutationRecord[0].target.classList.contains(
					'blurred-content'
				) &&
			mutationRecord[0].oldValue.match(/blurred-content/)
		) {
			props.onClose()
		}
	}

	useEffect(() => {
		return initObserver(observation)
	}, [])
	const scrollTop = document.documentElement.scrollTop
		? document.documentElement.scrollTop
		: 0
	return (
		<div className="hide-modal">
			<div
				id="modal"
				className="modal-off"
				onClick={closeModal}
				data-testid="modal-close"
			/>
			<div
				id="modal-form"
				className="modal-form-off"
				data-testid="modal-form"
			>
				<div id="modal-content">
					<div id="modal-head">
						<div className="modal-close" onClick={closeModal}>
							❌
						</div>
						<div className="title" data-testid="modal-title">
							{props.text}
						</div>
					</div>
					{props.children}
				</div>
			</div>
			<style jsx global>
				{`
					#modal-content {
						display: flex;
						flex-direction: column;
						width: 95%;
						min-height: 3.5em;
					}
					#modal-head {
						display: flex;
						flex-direction: row-reverse;
						align-items: center;
						width: 100%;
					}
					#modal-content .title {
						width: 100%;
						text-align: left;
						padding: 0.5em;
						text-transform: capitalize;
					}
					#modal-content .modal-close {
						color: #989697;
						display: flex;
						flex-direction: row;
						justify-content: flex-end;
						cursor: pointer;
					}
					.modal-on {
						background-color: rgb(60, 60, 60, 0.5);
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
					.modal-off {
						visibility: hidden;
					}
					.modal-gone {
						display: none;
					}
					.modal-form-on {
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
						background-color: #fbfbf8;
					}

					#modal-content form {
						display: flex;
						flex-direction: column;
						align-content: center;
						max-height: 100%;
					}

					#modal-content form .mdc-text-field,
					#modal-content form .mdc-select,
					#modal-content form .error,
					#modal-content form .success,
					#modal-content form .warn {
						margin: 0.5em;
					}

					#modal-content form .modal-submit {
						display: flex;
						flex-direction: column;
						align-content: center;
						justify-content: flex-end;
					}

					#modal-content form .modal-submit .primary-button {
						margin: 16px 8px;
					}

					.modal-form-off {
						visibility: hidden;
					}

					.modal-form-gone {
						display: none;
					}

					.hide-modal {
						height: 0;
						overflow: hidden;
					}
				`}
			</style>
		</div>
	)
}

export default ModalContent
