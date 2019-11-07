import { h } from 'preact'
import { useState } from 'preact/hooks'
import style from './style'
const message = {
	one: {
		lead: 'Imagine an internet where',
		body: 'terms of service are defined by the people who participate.',
	},
	two: {
		body:
			'discussion forums are moderated by participants elected from their peers.',
	},
	three: {
		body:
			'participation is limited to verified members of your local community.',
	},
	four: {
		lead: 'We declare interdependence and establish these core rights',
		body: '',
	},
	five: {
		lead: 'The right to organize',
		body:
			'all verified personas have the right to organize a campaign and run for moderator of their local group, the campaign with the most votes leads the moderation of the majority forum, any other campaign obtaining 10% or more of the vote is allowed to form a minority forum in which they are responsible for moderation.',
	},
	six: {
		lead: 'The right to define terms of service',
		body:
			'all verified personas have the right to organize a campaign to petition for changes to the terms of service; a petition signed by ten percent of the community will become an initiative which then requires three fourths of the community vote in an election.',
	},
	seven: {
		lead: 'The right to local participation',
		body:
			'all verified personas are allowed to participate in their local majority forum either sharing their identity or withholding it, while posted content may be moderated or downvoted it cannot be removed. Only in instances where personally identifying information or implications of violence are shared will content be removed.',
	},
	eight: {
		lead: '',
		body:
			'Persona verification is critical to prevent brigading and campaigns to manipulate public opinion.',
	},
	nine: {
		lead: '',
		body:
			'We require all participants hold a valid voter registration in the United States, once you provide your personal details our team will verify your registration in your state and send you a letter in the mail with your approval code.',
	},
	ten: {
		lead: '',
		body:
			'The personal details provided are only ever used to verify your registration, while we process the data it is stored encrypted and is removed from our system upon completion.',
	},
	eleven: {
		lead: '',
		body:
			'Once your approval code has been entered into your account you will gain access to participate in all of your local forums.',
	},
	twelve: {
		lead: '',
		body:
			'Join us in creating the worlds first democratically defined social media platform: ASMBLY',
	},
	thirteen: {
		lead: '',
		body: (
			<div>
				<div class="centered">
					<input type="text" placeholder="email" />
				</div>
				<div class="centered">
					<input type="submit" value="request invite" />
				</div>
			</div>
		),
	},
}

const hasNavBack = [
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
	'ten',
	'eleven',
	'twelve',
	'thirteen',
]

const hasNavForward = [
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
	'ten',
	'eleven',
	'twelve',
]

const Home = () => {
	const [section, setSection] = useState('one')

	const showSectionNavBack = section => {
		if (hasNavBack.indexOf(section) > -1) {
			return (
				<span
					class={style.clicky}
					onClick={() => {
						switch (section) {
							case 'two':
								setSection('one')
								break
							case 'three':
								setSection('two')
								break
							case 'four':
								setSection('three')
								break
							case 'five':
								setSection('four')
								break
							case 'six':
								setSection('five')
								break
							case 'seven':
								setSection('six')
								break
							case 'eight':
								setSection('seven')
								break
							case 'nine':
								setSection('eight')
								break
							case 'ten':
								setSection('nine')
								break
							case 'eleven':
								setSection('ten')
								break
							case 'twelve':
								setSection('eleven')
								break
							case 'thirteen':
								setSection('twelve')
								break
							default:
								setSection('thirteen')
								break
						}
					}}
				>
					⬅️
				</span>
			)
		} else {
			return <span>⏹</span>
		}
	}

	const showSectionNavForward = section => {
		if (hasNavForward.indexOf(section) > -1) {
			return (
				<span
					class={style.clicky}
					onClick={() => {
						switch (section) {
							case 'two':
								setSection('three')
								break
							case 'three':
								setSection('four')
								break
							case 'four':
								setSection('five')
								break
							case 'five':
								setSection('six')
								break
							case 'six':
								setSection('seven')
								break
							case 'seven':
								setSection('eight')
								break
							case 'eight':
								setSection('nine')
								break
							case 'nine':
								setSection('ten')
								break
							case 'ten':
								setSection('eleven')
								break
							case 'eleven':
								setSection('twelve')
								break
							case 'twelve':
								setSection('thirteen')
								break
							default:
								setSection('two')
								break
						}
					}}
				>
					➡️
				</span>
			)
		} else {
			return <span>⏹</span>
		}
	}

	return (
		<div class="content">
			<div class={`centered ${style.nav}`}>
				{showSectionNavBack(section)}
				======================================
				{showSectionNavForward(section)}
			</div>
			<div class={`centered ${style.pointed}`}>
				{message[section].lead}
			</div>
			<div class={`centered ${style.pointed}`}>
				{message[section].body}
			</div>
			<div class="centered">======================================</div>
		</div>
	)
}

export default Home
