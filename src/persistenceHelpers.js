import { map, uniq, set } from 'lodash'
import { storage } from './utils'

/*  Helpers for saving/loading session info from storage */

// This string prefixes the key of everything we store
const STORAGE_PREFIX = 'redux-sessions'

// Creates a storage key for a given user type and the data type being stored.
// E.g. ('user', 'token') -> 'redux-sessions:user:token'
function serializeStorageKey (userType, dataType) {
  return [ STORAGE_PREFIX, dataType, userType ].join(':')
}

// Splits a storage key into its parts so we can retrieve info about what's being stored.
function deserializeStorageKey (storageKey) {
  // eslint-disable-next-line
  const [ _, dataType, userType ] = storageKey.split(':')
  return { dataType, userType }
}

// Given a storage key, returns the user type.
function getUserTypeFromStorageKey (storageKey) {
  const { userType } = deserializeStorageKey(storageKey)
  return userType
}

// Returns the storage key for storing a user token.
function tokenStorageKey (userType) {
  return serializeStorageKey(userType, 'token')
}

// Returns the storage key for storing a user's persistence.
function persistStorageKey (userType) {
  return serializeStorageKey(userType, 'persist')
}

// Loads the redux state from local / session storage.
// We use the storage prefix to figure out which values we've saved.
export function loadSessionState () {
  const storageKeys = storage.getAllKeys().filter(key => key.startsWith(STORAGE_PREFIX))
  const userTypes = uniq(storageKeys.map(getUserTypeFromStorageKey))
  const state = {}
  userTypes.forEach(userType => set(state, userType, {
    token: storage.getItem(tokenStorageKey(userType)),
    persist: !!storage.getItem(persistStorageKey(userType)),
  }))
  return state
}

// Saves the redux state to local / session storage.
export function saveSessionState (state) {
  return map(state, ({ token, persist }, userType) => {
    storage.setItem(tokenStorageKey(userType), token, { persist })
    storage.setItem(persistStorageKey(userType), persist, { persist })
  })
}
