import { uniq, merge, keys, once } from 'lodash'

// Unified interface for local and session storage

// Returns true if local storage is available
export const isAvailable = once(() => {
  try {
    const key = '__TEST__'
    localStorage.setItem(key, key)
    localStorage.getItem(key, key)
    localStorage.removeItem(key)
    return true
  } catch (e) {
    return false
  }
})

// Get item from local storage, falling back to session storage
export function getItem (key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

// Set item in local storage, or session storage if specified
export function setItem (key, value, { persist=true, allowFalsey=false }={}) {
  if (!allowFalsey && !value) return removeItem(key)
  return persist
    ? localStorage.setItem(key, value)
    : sessionStorage.setItem(key, value)
}

// Remove item from local storage and session storage
export function removeItem (key) {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

// Get all keys from local storage and session storage
export function getAllKeys () {
  return uniq(merge(keys(localStorage), keys(sessionStorage)))
}
