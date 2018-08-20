import Storage from 'dom-storage'

// This file will be run before each individual test file.
// Here we're using it to set up some storage mocks.

global.localStorage = new Storage(null, { strict: true })
global.sessionStorage = new Storage(null, { strict: true })
