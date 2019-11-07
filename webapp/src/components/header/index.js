import { h } from 'preact'
import { Link } from 'preact-router/match'
import AsciiLogo from '../ascii-logo'
import Marquee from '../marquee'

const marqueeMessages = [
	'a game of politics',
	'moderation with representation',
	'we play in a society',
	'protecting minority voices',
]

const Header = () => (
	<header>
		<AsciiLogo />
		<Marquee messages={marqueeMessages} />
	</header>
)

export default Header
