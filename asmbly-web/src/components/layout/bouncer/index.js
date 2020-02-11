import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { PersonaConsumer } from '../../../hooks/context/persona'
import * as error from '../../../common/error'

const allowances = {
	AUTH: 'authorized',
	MODERATOR: 'moderator',
	PARTICIPANT: 'participant',
	UNAUTH: 'unauthorized',
	UNKN: 'unknown',
}

const Bouncer = props => {
	const [authentic, setAuthentic] = useState(false)
	const [allowance, setAllowance] = useState(allowances.UNKN)
	return (
		<PersonaConsumer>
			{persona => {
				if (persona && persona.auth) {
					if (props.staff) {
						props.isAllowed(persona.claims.staff)
						setAllowance(allowances.AUTH)
					} else if (props.administrator) {
						props.isAllowed(persona.claims.administrator)
						setAllowance(allowances.AUTH)
					} else if (props.moderator) {
						if (authentic) {
						} else {
							console.log('moderator', persona.claims.moderator)
							props.isAllowed(persona.claims.moderator)
							setAllowance(allowances.MODERATOR)
						}
					} else if (props.pnyx) {
						props.isAllowed(persona.claims.role === 'participant')
						setAllowance(allowances.PARTICIPANT)
					} else {
						setAllowance(allowances.UNAUTH)
						props.isAllowed(false)
					}
					setAuthentic(persona)
				}

				return <div tag={allowance} />
			}}
		</PersonaConsumer>
	)
}

export default Bouncer
