import { saveSessionState } from './persistenceHelpers'
import { throttle } from 'lodash'
import { isTestMode } from './utils'

const DEFAULT_DEBOUNCE_INTERVAL = 500

// Adds store subscription that persists session state in local storage
function enhancer ({ 
  persist=true,
  debounce=true,
  debounceInTestMode=false,
  debounceInterval=DEFAULT_DEBOUNCE_INTERVAL,
}={}) {
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
      // Don't debounce in test mode, unless otherwise specified
      const doDebounce = isTestMode() 
        ? debounceInTestMode
        : debounce
      const subscription = doDebounce ? throttle(persistState, debounceInterval) : persistState
      store.subscribe(subscription)
      return store
    }
  }
}

export default enhancer