import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { PersonaConsumer } from '../../../hooks/context/persona'
import useUnresolvedReports from '../../../hooks/subscribe/useUnresolvedReports'
// prettier ignore
const ascii = `
    _  ____ __  __ ___ _ __   __
   /_\\\/ ___|  \\/  | _ ) |\\ \\ / /
  / _ \\\ __ \\\ |\\/| | _ \\ |_\\ V / 
 /_/ \\\_\\\___/_|  |_|___/____|_|  
`

const levels = [
	'🐭',
	'🐮',
	'🐯',
	'🐰',
	'🐙',
	'🐸',
	'🦌',
	'🦡',
	'🐵',
	'🦇',
	'🐶',
	'🐷',
]

const calculateLevel = score => {
	if (score < 100) return 0
	else if (score < 200) return 1
	else if (score < 300) return 2
	else if (score < 500) return 3
	else if (score < 700) return 4
	else if (score < 1000) return 5
	else if (score < 1300) return 6
	else if (score < 1800) return 7
	else if (score < 2300) return 8
	else if (score < 3000) return 9
	else if (score < 4000) return 10
	else if (score < 5000) return 11
}

const AsciiMenu = props => {
	const [level, setLevel] = useState(0)
	const [reports, setReports] = useState(0)
	const [requester, setRequester] = useState(false)

	const active = props.active
		? props.active
		: {
				pnyx: false,
				coalesce: false,
				messages: false,
				elections: false,
				persona: false,
				reports: reports,
		  }

	useEffect(() => {
		const level = calculateLevel(
			requester.persona ? requester.persona.participationScore : 0
		)
		setLevel(level)

		if (
			requester.claims &&
			requester.claims.moderator &&
			requester.persona
		) {
			useUnresolvedReports(requester.persona.pnyx[0], qs => {
				setReports(qs.size)
			})
		}
	}, [requester.persona, requester.claims])

	return (
		<PersonaConsumer>
			{personaIn => {
				setRequester(personaIn)
				const authMenu = [
					{
						className:
							window.location.pathname === '/pnyx/prime'
								? 'seen'
								: 'notice',
						title: 'pnyx',
						href: '/pnyx/prime',
						emoji: '⛰',
					},
					{
						className: active.coalesce ? 'notice' : 'seen',
						title: 'coalesce',
						href: '/coalesce',
						emoji: '🌱',
					},
					{
						className: active.messages ? 'notice' : 'seen',
						title: 'messages',
						href: '/messages',
						emoji: '📪',
					},
					{
						className: active.elections ? 'notice' : 'seen',
						title: 'elections',
						href: '/elections',
						emoji: '🗳',
					},
					{
						className: active.pnyx ? 'notice' : 'seen',
						title: 'persona',
						href: '/persona/me',
						emoji: levels[props.level ? props.level : 0],
					},
				]

				if (requester.claims && requester.claims.moderator) {
					authMenu.push({
						className: reports ? 'notice' : 'seen',
						title: 'reports',
						href: '/pnyx/prime/review-reports',
						emoji: '🙋',
					})
				}

				const unauthMenu = [
					{
						className: 'notice',
						title: 'sign up',
						href: '/sign-up',
						emoji: '🛎',
					},
				]

				const menu = requester.claims
					? authMenu.map(menuItem => {
							return (
								<span>
									<Link
										className={menuItem.className}
										title={menuItem.title}
										to={menuItem.href}
									>
										{menuItem.emoji}
									</Link>
								</span>
							)
					  })
					: unauthMenu.map(menuItem => {
							return (
								<span>
									<Link
										className={menuItem.className}
										title={menuItem.title}
										to={menuItem.href}
									>
										{menuItem.emoji}
									</Link>
								</span>
							)
					  })

				return (
					<span className="logoRow">
						<pre className="ascii">{`${ascii}`}</pre>

						<div className="menu">{menu}</div>
						<style jsx="true" global="true">{`
							.logoRow {
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;
								width: 100%;
							}
							.menu {
								font-family: apple color emoji, segoe ui emoji,
									segoe ui symbol, Roboto, helvetica neue,
									Arial, sans-serif;
								margin: 0.23em 0;
								display: flex;
								justify-content: center;
								align-items: center;
								width: 23em;
							}

							.menu span {
								margin: 0 1em;
							}
							.menu span a {
								text-decoration: none;
								font-weight: 100;
								filter: grayscale(100%);
							}
							.menu span a.notice {
								filter: none;
							}
						`}</style>
					</span>
				)
			}}
		</PersonaConsumer>
	)
}

export default AsciiMenu
