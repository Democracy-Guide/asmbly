import React from 'react'

const InviteRequestsContext = React.createContext([])
export const InviteRequestsProvider = InviteRequestsContext.Provider
export const InviteRequestsConsumer = InviteRequestsContext.Consumer
export default InviteRequestsContext
