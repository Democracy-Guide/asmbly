import React from 'react'
import ReactDOM from 'react-dom'
// prettier ignore
const ascii = `
    _  ____ __  __ ___ _ __   __
   /_\\\/ ___|  \\/  | _ ) |\\ \\ / /
  / _ \\\ __ \\\ |\\/| | _ \\ |_\\ V / 
 /_/ \\\_\\\___/_|  |_|___/____|_|  
`
const AciiLogo = () => (
	<span className="logoRow">
		<pre className="ascii">{`${ascii}`}</pre>
		<div className="lenny">
			<span>( ͡° ͜ʖ ͡°)</span>
			<span>( ͡° ͜ʖ ͡°)</span>
			<span>( ͡° ͜ʖ ͡°)</span>
			<span>( ͡° ͜ʖ ͡°)</span>
			<span>( ͡° ͜ʖ ͡°)</span>
		</div>
		<style jsx>{`
			.logoRow {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 100%;
			}
			.lenny {
				font-family: apple color emoji, segoe ui emoji, segoe ui symbol,
					Roboto, helvetica neue, Arial, sans-serif;
				margin: 0.23em 0;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 22em;
			}

			.lenny span {
				margin: 0 0.23em;
			}
		`}</style>
	</span>
)

export default AciiLogo
