import { saveSessionState } from './persistenceHelpers'
import { debounce } from 'lodash'

// Adds storage functionality to sessions info
function enhancer ({ persist=true, debounceInterval=500 }={}) {
  return function enhance (createStore) {
    return function newCreateStore (...args) {
      const store = createStore(...args)
      if (!persist) return store 
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