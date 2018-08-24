import { loadSessionState, saveSessionState } from './persistenceHelpers'

let CACHED_SESSION_STATE = loadSessionState()

// Adds store subscription that persists session state in local storage
function enhancer ({ persist=true }={}) {
  return function enhance (createStore) {
    return function newCreateStore (...args) {
      const store = createStore(...args)
      if (!persist) return store
      store.subscribe(() => {
        const sessionState = store.getState().sessions
        if (!sessionState) throw new Error('redux-sessions: error when attempting to save state. Did you remember to attach the reducer at key `sessions`?')
        if (sessionState === CACHED_SESSION_STATE) return
        CACHED_SESSION_STATE = sessionState
        return saveSessionState(sessionState)
      })
      return store
    }
  }
}

export default enhancer