import { h } from 'preact'
import { Link } from 'preact-router/match'
import style from './style.css'
// prettier ignore
const ascii = `
    _  ____ __  __ ___ _ __   __
   /_\\\/ ___|  \\/  | _ ) |\\ \\ / /
  / _ \\\ __ \\\ |\\/| | _ \\ |_\\ V / 
 /_/ \\\_\\\___/_|  |_|___/____|_|  
`
const AciiLogo = () => (
	<span class={style.logoRow}>
		<pre class="lenny">( ͡° ͜ʖ ͡°)</pre>
		<pre class={style.ascii}>{`${ascii}`}</pre>
		<pre class="lenny">( ͡° ͜ʖ ͡°)</pre>
	</span>
)

export default AciiLogo
