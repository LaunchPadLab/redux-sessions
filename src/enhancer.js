import { saveSessionState } from './persistenceHelpers'
import { debounce } from 'lodash'

// Adds storage functionality to sessions info
function enhancer ({ persist=true }={}) {
  return function enhance (createStore) {
    return function newCreateStore (...args) {
      const store = createStore(...args)
      if (persist) store.subscribe(
        debounce(() => saveSessionState(store.getState()), 500)
      )
      return store
    }
  }
}

export default enhancer