import { h } from 'preact'
import { Link } from 'preact-router/match'
import style from './style.css'

const Marquee = props => (
	<div class={style.marquee}>
		<div class={style.flow}>
			{props.messages.map(message => {
				return <div class={style.spaced}>{message}</div>
			})}
		</div>
	</div>
)

export default Marquee
