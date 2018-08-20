import { createAction } from 'redux-actions'

const ACTION_NAMESPACE = '@@redux-sessions/'

export const setToken = createAction(ACTION_NAMESPACE + 'SET_TOKEN', 
  (token, { userType, persist }={}) => ({ token, userType, persist })
)

export const clearToken = createAction(ACTION_NAMESPACE + 'CLEAR_TOKEN')

// Aliases
export const login = setToken
export const logout = clearToken
