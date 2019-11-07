import { h } from 'preact'
import { Link } from 'preact-router/match'
import AsciiLogo from '../ascii-logo'
import Marquee from '../marquee'
import style from './style.css'

const asciiYinYang = `
            _..ooooo..._
       _..oo888p..      "Y.._
     .8998888888888o.      "Yb.
   .d88888P"""""Y8888b        "b.
  o8888888 ͡° ͜ʖ ͡° 88888)         "b
 d88888888b.....d8888P           'b
 8888888888888888888"             8
(88DWB888888888888P               8)
 888888888888888P                 8
 Y8888888888888P     eeeee       .P
  Y88888888888(      ͡° ͜ʖ ͡°      oP
   "Y8888888888b     """""    oP"
     "Y888888888o._       _.oP"
       \`""Y88888booooooodP""'
          \`""Y8888888P""'    
`

const Footer = () => (
  <div class={style.pre}>
    We the personas of the United Pnyx of ASMBLY, in order to form a more
    perfect internet, establish access, insure local moderation, provide for the
    minority voice, promote the spirit of democracy, and secure the benefits of
    open discourse to ourselves and our posterity, do ordain and establish this
    website.
    <pre class="ascii">{asciiYinYang}</pre>
  </div>
)

export default Footer
