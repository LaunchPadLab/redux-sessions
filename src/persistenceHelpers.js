import { map, last, uniq } from 'lodash'
import { storage } from './utils'
import { get, set } from 'lodash/fp'

// Storage keys

const STORAGE_PREFIX = 'redux-sessions'

function tokenStorageKey (userKey) {
  return STORAGE_PREFIX + ':token:' + userKey
}

function persistStorageKey (userKey) {
  return STORAGE_PREFIX + ':persist:' + userKey
}

function getUserKeyFromStorageKey (storageKey) {
  return last(storageKey.split(':'))
}

// Storage helpers

export function loadSessionState () {
  const userKeys = uniq(storage.getAllKeys()
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .map(getUserKeyFromStorageKey))
  const state = {}
  userKeys.forEach(userKey => set(userKey, {
    token: storage.getItem(tokenStorageKey(userKey)),
    persist: !!storage.getItem(persistStorageKey(userKey)),
  }, state))
  return state
}

export function saveSessionState (state) {
  const sessionState = get('sessions', state)
  if (!sessionState) throw new Error('redux-sessions: error when attempting to save state. Did you remember to attach the reducer at key `sessions`?')
  return map(sessionState, ({ token, persist }, userKey) => {
    storage.setItem(tokenStorageKey(userKey), token, { persist })
    storage.setItem(persistStorageKey(userKey), persist)
  })
}
