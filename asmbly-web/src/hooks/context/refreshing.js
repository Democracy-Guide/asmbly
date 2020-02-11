import React from 'react'

const RefreshingContext = React.createContext({ refresh: true, UID: '' })
export const RefreshingProvider = RefreshingContext.Provider
export const RefreshingConsumer = RefreshingContext.Consumer
export default RefreshingContext
