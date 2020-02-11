import React from 'react'
import ReactDOM from 'react-dom'
import AsciiLogo from '../../ascii/ascii-logo'
import Marquee from '../marquee'

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
  <div className="pre">
    We the personas of the United Pnyx of ASMBLY, in order to form a more
    perfect internet, establish access, insure local moderation, provide for the
    minority voice, promote the spirit of democracy, and secure the benefits of
    open discourse to ourselves and our posterity, do ordain and establish this
    website.
    <pre className="ascii">{asciiYinYang}</pre>
    <style jsx>{`
      .pre {
        height: 123em;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        font-size: xx-small;
        align-items: center;
        max-width: 30em;
        min-width: 21.75em;
        margin: 0 auto;
      }
    `}</style>
  </div>
)

export default Footer
