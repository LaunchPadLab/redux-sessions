import { loadSessionState, saveSessionState } from '../src/persistenceHelpers'
import { storage } from '../src/utils'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('loadSessionState()', () => {
  it('loads session state from localStorage and sessionStorage', () => {
    const advisorToken = 'foo'
    const advisorPersist = true
    const clientToken = 'bar'
    const clientPersist = false
    storage.setItem('redux-sessions:token:advisor', advisorToken)
    storage.setItem('redux-sessions:persist:advisor', advisorPersist)
    storage.setItem('something-else', 'baz')
    storage.setItem('redux-sessions:token:client', clientToken, { persist: false })
    storage.setItem('redux-sessions:persist:client', clientPersist, { persist: false })
    const state = loadSessionState()
    expect(state).toEqual({ 
      advisor: { token: advisorToken, persist: advisorPersist },
      client: { token: clientToken, persist: clientPersist } 
    })
  })
})

describe('saveSessionState()', () => {
  it('saves session state to localStorage and sessionStorage', () => {
    const advisorToken = 'foo'
    const advisorPersist = true
    const clientToken = 'bar'
    const clientPersist = false
    const state = {
      advisor: { token: advisorToken, persist: advisorPersist },
      client: { token: clientToken, persist: clientPersist } 
    }
    saveSessionState(state)
    expect(localStorage.getItem('redux-sessions:token:advisor')).toEqual(advisorToken)
    expect(localStorage.getItem('redux-sessions:persist:advisor')).toEqual(String(advisorPersist))
    expect(sessionStorage.getItem('redux-sessions:token:client')).toEqual(clientToken)
    expect(sessionStorage.getItem('redux-sessions:persist:client')).toEqual(null)
  })
})

test('persistence helpers are reciprocal', () => {
  const state = {
    advisor: { token: 'foo', persist: true },
    client: { token: 'bar', persist: false } 
  }
  saveSessionState(state)
  expect(loadSessionState()).toEqual(state)
})