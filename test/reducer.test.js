import { reducer, actions, selectors } from '../src'
import { saveSessionState } from '../src/persistenceHelpers'

describe('reducer', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  it('loads latest state from local storage when reset', () => {
    const initialState = { user: { token: 'first token', persist: true }}
    saveSessionState(initialState)
    // Passing `undefined` for state resets the reducer
    expect(reducer(undefined, {})).toEqual(initialState)
    const newInitialState = { user: { token: 'other token', persist: true }}
    saveSessionState(newInitialState)
    expect(reducer(undefined, {})).toEqual(newInitialState)
  })
})

// Tests for actions and selectors

describe('actions.setToken()', () => {
  it('sets token in the state', () => {
    const token = 'foo'
    const initialState = {}
    const action = actions.setToken(token)
    const newState = reducer(initialState, action)
    expect(newState.user.token).toEqual(token)
  })
  it('can receive a custom user type', () => {
    const token = 'foo'
    const userType = 'bar'
    const initialState = {}
    const action = actions.setToken(token, { userType })
    const newState = reducer(initialState, action)
    expect(newState.bar.token).toEqual(token)
  })
  it('defaults persist to true', () => {
    const token = 'foo'
    const initialState = {}
    const action = actions.setToken(token)
    const newState = reducer(initialState, action)
    expect(newState.user.persist).toEqual(true)
  })
  it('can receive a false persist argument', () => {
    const token = 'foo'
    const initialState = {}
    const action = actions.setToken(token, { persist: false })
    const newState = reducer(initialState, action)
    expect(newState.user.persist).toEqual(false)
  })
})

describe('actions.clearToken()', () => {
  it('clears token in the state', () => {
    const initialState = { user: { token: 'foo' }}
    const action = actions.clearToken()
    const newState = reducer(initialState, action)
    expect(newState.user.token).toEqual(null)
  })
  it('sets persist to false in state', () => {
    const initialState = { user: { persist: true }}
    const action = actions.clearToken()
    const newState = reducer(initialState, action)
    expect(newState.user.persist).toEqual(false)
  })
  it('can receive a custom user type', () => {
    const userType = 'bar'
    const initialState = { user: { token: 'foo' } }
    const action = actions.clearToken({ userType })
    const newState = reducer(initialState, action)
    expect(newState.user.token).toEqual('foo')
    expect(newState.bar.token).toEqual(null)
  })
})

// Selectors

describe('selectors.token()', () => {
  it('throws when session state is not available', () => {
    const state = {}
    expect(() => selectors.token(state)).toThrow()
  })
  it('fetches default user token from state', () => {
    const token = 'foo'
    const state = { sessions: { user: { token }}}
    expect(selectors.token(state)).toEqual(token)
  })
  it('can receive a custom user type', () => {
    const token = 'foo'
    const userType = 'bar'
    const state = { sessions: { bar: { token }}}
    expect(selectors.token(state, { userType })).toEqual(token)
  })
})

describe('selectors.isAuthenticated()', () => {
  it('throws when session state is not available', () => {
    const state = {}
    expect(() => selectors.isAuthenticated(state)).toThrow()
  })
  it('returns true when user has token in state', () => {
    const token = 'foo'
    const state = { sessions: { user: { token }}}
    expect(selectors.isAuthenticated(state)).toEqual(true)
  })
  it('returns false when user does not have token in state', () => {
    const state = { sessions: {}}
    expect(selectors.isAuthenticated(state)).toEqual(false)
  })
  it('can receive a custom user type', () => {
    const token = 'foo'
    const userType = 'bar'
    const state = { sessions: { bar: { token }}}
    expect(selectors.isAuthenticated(state, { userType })).toEqual(true)
  })
})

describe('selectors.isUnauthenticated()', () => {
  it('throws when session state is not available', () => {
    const state = {}
    expect(() => selectors.isUnauthenticated(state)).toThrow()
  })
  it('returns false when user has token in state', () => {
    const token = 'foo'
    const state = { sessions: { user: { token }}}
    expect(selectors.isUnauthenticated(state)).toEqual(false)
  })
  it('returns true when user does not have token in state', () => {
    const state = { sessions: {}}
    expect(selectors.isUnauthenticated(state)).toEqual(true)
  })
  it('can receive a custom user type', () => {
    const token = 'foo'
    const userType = 'bar'
    const state = { sessions: { bar: { token }}}
    expect(selectors.isUnauthenticated(state, { userType })).toEqual(false)
  })
})

export { reducer, selectors }
