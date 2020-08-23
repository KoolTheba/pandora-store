const { createStore, destroyStore, getStore, storeExists } = require('../')

const checkInterfaceAndValue = (store, value) => {
  // interface
  expect(typeof store.getState).toBe('function')
  expect(typeof store.subscribe).toBe('function')
  expect(typeof store.dispatch).toBe('function')
  // values
  expect(store.getState()).toEqual(value)
}

describe('STORE behaviour', () => {
  const fixtures = {
    storeName: 'todos',
    initialValue: [{ id: 0, title: 'Buy milk', complete: false }]
  }

  beforeEach(() => {
    if (storeExists(fixtures.storeName)) {
      destroyStore(fixtures.storeName)
    }
  })

  afterEach(() => {
    if (storeExists(fixtures.storeName)) {
      destroyStore(fixtures.storeName)
    }
  })

  describe('createStore', () => {
    test('Should create a store with default values and return the interface', () => {
      const store = createStore(fixtures.storeName, fixtures.initialValue)
      checkInterfaceAndValue(store, fixtures.initialValue)
    })

    test('Should create a store with an array as a default value', () => {
      const store = createStore(fixtures.storeName)
      checkInterfaceAndValue(store, [])
    })

    test('Should throw an error if the name is not defined', () => {
      expect(() => {
        createStore()
      }).toThrowError('Name is required to create a store')
    })

    test('Should throw an error if name is already in use', () => {
      const store = createStore(fixtures.storeName)
      checkInterfaceAndValue(store, [])

      expect(() => {
        createStore(fixtures.storeName)
      }).toThrowError('Name already in use. Aborting store creation')
    })
  })

  describe('destroyStore', () => {
    test('Should throw an error if name is not provided', () => {
      expect(() => {
        destroyStore()
      }).toThrowError('Name is required for destroying a store')
    })

    test('Should throw an error if name does not exist in the store', () => {
      createStore(fixtures.storeName)
      expect(() => {
        destroyStore('goals')
      }).toThrowError('Store does not exist')
    })

    test('Should return the current Store state if name exists', () => {
      createStore(fixtures.storeName, fixtures.initialValue)
      expect(destroyStore(fixtures.storeName)).toEqual(fixtures.initialValue)
    })
  })

  describe('getStore', () => {
    test('Should throw an error if name is not provided', () => {
      expect(() => {
        getStore()
      }).toThrowError('Name is required for retrieving a store')
    })

    test('Should throw an error if name does not exist in the store', () => {
      createStore(fixtures.storeName)
      expect(() => {
        getStore('goals')
      }).toThrowError('Store does not exist. Please try again with a correct name.')
    })

    test('Should return the interface if name exists in the store', () => {
      const store = createStore(fixtures.storeName)
      checkInterfaceAndValue(store, [])
    })
  })

  describe('storeExists', () => {
    test('Should return true if store exists', () => {
      createStore(fixtures.storeName)
      expect(storeExists(fixtures.storeName)).toBe(true)
    })

    test('Should return false if store does not exist', () => {
      expect(storeExists('invented')).toBe(false)
      expect(storeExists()).toBe(false)
    })
  })
})
