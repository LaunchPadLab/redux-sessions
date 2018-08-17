import { handleActions } from 'redux-actions'
import { set, get } from 'lodash/fp'
import * as actions from './actions'
import { loadSessionState } from './persistenceHelpers'

const DEFAULT_USER_KEY = 'user'

// Reducer

const initialState = loadSessionState()

const reducer = handleActions({
  [actions.setToken]: (state, { payload: { token, userKey=DEFAULT_USER_KEY, persist=true } }) => {
    return set(userKey, { token, persist }, state)
  },
  [actions.clearToken]: (state, { payload: { userKey=DEFAULT_USER_KEY }={}}) => {
    return set(userKey, { token: null, persist: false }, state)
  },
}, initialState)

// Selectors

const selectors = {}

selectors.token = function (state, { userKey=DEFAULT_USER_KEY }={}) {
  if (!get('sessions', state)) throw new Error('redux-sessions: state not found. Did you remember to attach the reducer at key `sessions`?')
  return get('sessions.' + userKey + '.token', state)
}

selectors.isAuthenticated = function (state, options) {
  return !!selectors.token(state, options)
}

selectors.isUnauthenticated = function (state, options) {
  return !selectors.isAuthenticated(state, options)
}

export { reducer, selectors }
