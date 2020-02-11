import React from 'react'

const PersonaContext = React.createContext({ authentic: {}, claims: {} })
export const PersonaProvider = PersonaContext.Provider
export const PersonaConsumer = PersonaContext.Consumer
export default PersonaContext
