import { enhancer } from '../src'

function mockCreateStore (initialState) {
  const mockStore = {}
  mockStore.subscribe = func => mockStore.subscription = func
  mockStore.getState = jest.fn(() => initialState)
  return mockStore
}

describe('enhancer()', () => {
  it('adds a store subscription that calls store.getState()', () => {
    const initialState = { sessions: {} }
    const enhance = enhancer()
    const createStore = enhance(mockCreateStore)
    const store = createStore(initialState)
    expect(store.subscription).toBeDefined()
    store.subscription()
    expect(store.getState).toHaveBeenCalled()
  })
  it('subscription throws when session state is not found', () => {
    const initialState = {}
    const enhance = enhancer()
    const createStore = enhance(mockCreateStore)
    const store = createStore(initialState)
    expect(store.subscription).toBeDefined()
    expect(() => store.subscription()).toThrow()
  })
  it('skips the store subscription if persist option is false', () => {
    const enhance = enhancer({ persist: false })
    const createStore = enhance(mockCreateStore)
    const store = createStore()
    expect(store.subscription).not.toBeDefined()
  })
})
