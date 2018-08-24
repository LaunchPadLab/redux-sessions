# redux-sessions
*App-wide session management in Redux.*

[![NPM version](https://img.shields.io/npm/v/redux-sessions.svg?style=flat-square)](https://www.npmjs.com/package/redux-sessions)

This library allows the straightforward management of global session state via Redux action creators and selectors. It also includes functionality for persisting session state in local storage out of the box.

## Example

```javascript

import { applyMiddleware, createStore, combineReducers, compose } from 'redux'
import {
    reducer as sessionsReducer,
    enhancer as sessionsEnhancer,
    actions as sessionsActions,
    selectors as sessionsSelectors,
} from 'redux-sessions'

// First, include the sessions reducer keyed under 'sessions' in your root reducer

const reducer = combineReducers({
    sessions: sessionsReducer
    ...
})

// Then, include the sessions enhancer to enable persistence in local storage

  const enhancers = compose(
    applyMiddleware(
      ...any middleware...
    ),
    sessionsEnhancer(),
  )

const store = createStore(reducer, {}, enhancers)

// Now you can dispatch session actions

const action = sessionsActions.setToken('A session token!')
store.dispatch(action)

// And access session information from the state

const state = store.getState()

sessionsSelectors.token(state)
// => 'A session token!'

```

## API

### Action creators

`redux-sessions` exposes the following action creators, namespaced under `actions`:

- `actions.setToken(token, options)`: Set a session token in the state.
- `actions.clearToken(options)`: Clear a session token from the state.
- `actions.login(token, options)`: An alias for `actions.setToken()`.
- `actions.logout(options)`: An alias for `actions.clearToken()`.

The `options` object passed to these action creators may contain the following attributes:

- `userType (default='user')`: A string identifying which type of user the session token belongs to. This option is useful if you need to allow different types of users to log into different parts of your application concurrently.
- `persist`: A flag indicating whether to persist the token across sessions- under the hood, this flag determines whether the token is saved in `localStorage` or `sessionsStorage`.

### Enhancer

The `redux-sessions` enhancer is what allows the session state to persist across page refreshes. It can receive the following options:

- `persist (default=true)`: A flag indicating whether or not to persist session state.
- `debounce (default=true)`: A flag indicating whether or not to debounce writing to `localStorage`.
- `debounceInTestMode (default=false)`: A flag indicating whether or not to debounce writing to `localStorage` when `NODE_ENV === 'test'`.
- `debounceInterval (default=500)`: The debounce interval used when writing session state to `localStorage` (ms).

### Selectors

`redux-sessions` exposes the following state selectors, namespaced under `selectors`:

- `selectors.token(state, options) -> string`: Retrieves a session token from the state.
- `selectors.isAuthenticated(state, options) -> bool`: Returns `true` when a session token exists.
- `selectors.isUnauthenticated(state, options) -> bool`: Returns `true` when a session token does not exist.

The `options` object passed to these selectors may contain the following attributes:

- `userType (default='user')`: A string identifying which type of user to retrieve information for.

### Reducer

`redux-sessions` exposes a reducer to handle the actions it creates. This reducer must be attached to your root reducer using the key `sessions` in order for the library to function (see [example](#example)).

## Authentication example

Here's a simple example of how `redux-sessions` can be used to conditionally display an authenticated portion of an app:

```javascript

import React from 'react'
import { connect } from 'react-redux'
import { actions as sessionsActions, selectors as sessionsSelectors } from 'redux-sessions'

// This component is passed an external auth function that resolves with a session token.

function View ({ isAuthenticated, externalAuthFunction, login }) {
    return (
        <div>
            {
                isAuthenticated && 
                <div> Only an admin can see this! </div>
            }
            <button onClick={ () => externalAuthFunction().then(token => login(token, { userType: 'admin' })) }>
                Login
            </button>
        </div>
    )
}

function mapStateToProps (state) {
    return {
        isAuthenticated: sessionsSelectors.isAuthenticated(state, { userType: 'admin' })
    }
}

const mapDispatchToProps = {
  login: sessionsActions.login,
}

export default connect(mapStateToProps, mapDispatchToProps)(View)

```
