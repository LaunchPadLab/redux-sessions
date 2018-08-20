import { handleActions } from 'redux-actions'
import { set, get } from 'lodash/fp'
import * as actions from './actions'
import { loadSessionState } from './persistenceHelpers'

const DEFAULT_USER_TYPE = 'user'

// Reducer

const initialState = loadSessionState()

const reducer = handleActions({
  [actions.setToken]: (state, { payload: { token, userType=DEFAULT_USER_TYPE, persist=true } }) => {
    return set(userType, { token, persist }, state)
  },
  [actions.clearToken]: (state, { payload: { userType=DEFAULT_USER_TYPE }={}}) => {
    return set(userType, { token: null, persist: false }, state)
  },
}, initialState)

// Selectors

const selectors = {}

selectors.token = function (state, { userType=DEFAULT_USER_TYPE }={}) {
  if (!get('sessions', state)) throw new Error('redux-sessions: state not found. Did you remember to attach the reducer at key `sessions`?')
  return get('sessions.' + userType + '.token', state)
}

selectors.isAuthenticated = function (state, options) {
  return !!selectors.token(state, options)
}

selectors.isUnauthenticated = function (state, options) {
  return !selectors.isAuthenticated(state, options)
}

export { reducer, selectors }
