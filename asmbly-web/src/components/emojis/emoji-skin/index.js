import React from 'react'

export default props => {
	const changeTone = e => {
		console.log('changing tone')
		document.querySelectorAll('.tone-active').forEach(node => {
			node.classList.remove('tone-active')
		})
		e.target.classList.add('tone-active')
		if (Boolean(e.target.id)) {
			props.setSkin(e.target.id)
		} else {
			props.setSkin(false)
		}
	}
	return (
		<div className="toner">
			<span className="no-tone tone-active" onClick={changeTone} />
			<span className="light-tone" id="1f3fb" onClick={changeTone} />
			<span className="med-light-tone" id="1f3fc" onClick={changeTone} />
			<span className="med-tone" id="1f3fd" onClick={changeTone} />
			<span className="med-dark-tone" id="1f3fe" onClick={changeTone} />
			<span className="dark-tone" id="1f3ff" onClick={changeTone} />
			<style jsx>{`
				.toner {
					display: ${props.displayToner};
					justify-content: flex-start;
					align-items: center;
					width: auto;
					position: relative;
				}
				.toner span {
					cursor: pointer;
					width: 21px;
					height: 21px;
					border-radius: 7px;
					margin: 0 4px 0 4px;
				}
				.no-tone {
					background-color: #fee133;
					border: none;
				}
				.light-tone {
					background-color: #f9dcba;
					border: none;
				}
				.med-light-tone {
					background-color: #dcb690;
					border: none;
				}
				.med-tone {
					background-color: #b58967;
					border: none;
				}
				.med-dark-tone {
					background-color: #a16a41;
					border: none;
				}
				.dark-tone {
					background-color: #6f5148;
					border: none;
				}
				.tone-active {
					border: 2px solid #ffac00 !important;
				}
			`}</style>
		</div>
	)
}
