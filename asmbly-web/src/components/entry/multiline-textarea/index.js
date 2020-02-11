import React from 'react'

const FullTextInput = props => {
	const handleChange = e => {
		props.setVal(e.target.value)
	}

	return (
		<div className="column">
			<textarea
				type={props.type ? props.type : 'text'}
				id={props.id}
				required={props.required ? props.required : false}
				onChange={handleChange}
				value={props.value}
				pattern={props.pattern}
				maxLength={props.maxlength ? props.maxlength : '524288'}
				placeholder={props.placeholder ? props.placeholder : ' '}
				rows={props.rows ? props.rows : '1'}
			/>
			<label htmlFor={props.id}>{props.label}</label>
			<style jsx>{`
				label {
					font-size: 16px;
					position: absolute;
					font-weight: 400;
					top: 0.5em;
					left: 0.5em;
					transition: 0.2s;
				}
				textarea {
					padding: 0.5em;
					font-size: 16px;
					padding: 14px 16px;
					display: inline-block;
					border-radius: 4px;
				}

				textarea:focus + label {
					font-size: 14px;
					font-weight: 400;
					top: -1.25em;
					left: 0;
				}
				textarea:not(:placeholder-shown) ~ label {
					font-size: 14px;
					font-weight: 400;
					top: -1.25em;
					left: 0;
				}
				.column {
					flex-grow: 1;
					float: left;
					margin-top: 2em;
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
