import { map, last, uniq, set } from 'lodash'
import { storage } from './utils'
import { get } from 'lodash/fp'

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
  userKeys.forEach(userKey => set(state, userKey, {
    token: storage.getItem(tokenStorageKey(userKey)),
    persist: !!storage.getItem(persistStorageKey(userKey)),
  }))
  return state
}

export function saveSessionState (state) {
  return map(state, ({ token, persist }, userKey) => {
    storage.setItem(tokenStorageKey(userKey), token, { persist })
    storage.setItem(persistStorageKey(userKey), persist, { persist })
  })
}
