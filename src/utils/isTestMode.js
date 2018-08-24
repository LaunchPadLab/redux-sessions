import { get } from 'lodash/fp'

function getEnv () {
  return (typeof process === 'undefined')
    ? null
    : get('env.NODE_ENV', process)
}

function isTestMode () {
  return getEnv() === 'test'
}

export default isTestMode