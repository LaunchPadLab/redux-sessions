import { saveSessionState } from './persistenceHelpers'
import { debounce } from 'lodash'

const DEFAULT_DEBOUNCE_INTERVAL = 500

// Adds store subscription that persists session state in local storage
function enhancer ({ persist=true, debounceInterval=DEFAULT_DEBOUNCE_INTERVAL }={}) {
  return function enhance (createStore) {
    return function newCreateStore (...args) {
      const store = createStore(...args)
      if (!persist) return store
      // Define subscription function
      function persistState () {
        const state = store.getState()
        if (!state.sessions) throw new Error('redux-sessions: error when attempting to save state. Did you remember to attach the reducer at key `sessions`?')
        return saveSessionState(state.sessions)
      }
      store.subscribe(debounce(persistState, debounceInterval))
      return store
    }
  }
}

export default enhancer