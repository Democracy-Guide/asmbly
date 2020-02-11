import React from 'react'

const FullTextInput = props => {
	const handleChange = e => {
		props.setVal(e.target.value)
	}

	return (
		<div className="column">
			<input
				type={props.type ? props.type : 'text'}
				id={props.id}
				required={props.required ? props.required : false}
				onChange={handleChange}
				value={props.value}
				pattern={props.pattern}
				maxLength={props.maxlength ? props.maxlength : '524288'}
				placeholder=" "
			/>
			<label
				htmlFor={props.id}
				onClick={() => {
					document.getElementById(props.id).focus()
				}}
			>
				{props.label}
			</label>
			<style jsx>{`
				label {
					font-size: 16px;
					position: absolute;
					top: 0.25em;
					left: 0.5em;
					transition: 0.2s;
				}
				input {
					font-size: 16px;
					padding-left: 0.5em;
					display: inline-block;
					border-radius: 4px;
				}

				input:focus + label {
					font-size: 14px;
					font-weight: 400;
					top: -1.25em;
					left: 0;
				}
				input:not(:placeholder-shown) ~ label {
					font-size: 14px;
					font-weight: 400;
					top: -1.25em;
					left: 0;
				}
				.column {
					flex-grow: 1;
					margin: 0.5em 0.1em 0 0.1em;
					min-height: 0.125rem;
					display: flex;
					flex-direction: column-reverse;
					position: relative;
				}
			`}</style>
		</div>
	)
}

export default FullTextInput
