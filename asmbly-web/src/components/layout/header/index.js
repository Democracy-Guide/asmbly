import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useParams } from 'react-router-dom'
import AsciiLogo from '../../ascii/ascii-logo'
import AsciiMenu from '../../ascii/ascii-menu'
import Marquee from '../marquee'
import PnyxPost from '../../entry/pnyx-post'
import { PersonaConsumer } from '../../../hooks/context/persona'

const marqueeMessages = [
	'a game of politics',
	'moderation with representation',
	'we play in a society',
	'protecting minority voices',
	'virtual democracy',
]

const Header = props => {
	const [requester, setRequester] = useState(false)
	const { personaName, pnyx } = useParams()

	console.log('header', pnyx, requester, personaName)

	const subsection =
		(pnyx || personaName) && requester.persona ? (
			<div className="content">
				<div className="centered pointed">
					<PnyxPost
						refreshPnyx={props.refreshPnyx}
						host={personaName ? personaName : false}
						guest={requester.persona.UID}
						pnyx={pnyx}
					/>
				</div>
			</div>
		) : props.review ? (
			''
		) : (
			<Marquee messages={marqueeMessages} />
		)

	const section =
		pnyx || personaName || props.review ? <AsciiMenu /> : <AsciiLogo />

	return (
		<PersonaConsumer>
			{personaIn => {
				setRequester(personaIn)
				return (
					<header>
						{section}
						{subsection}
					</header>
				)
			}}
		</PersonaConsumer>
	)
}

export default Header
