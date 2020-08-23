const debug = require('debug')('pandora-store')

const stores = {}
const getStateEntity = (entity) => () => stores[entity]
const subscribeEntity = (entity) => () => {}
const dispatchEntity = (entity) => () => {}

/**
 * Creates a Store
 * @function
 * @param {string} name - The store name
 * @param {array | object} initialValue - The initial value for the store
 * @return {object} - The Store interface
 */
const createStore = (name, initialValue = []) => {
  if (!name) {
    debug('Name is missing, store won\'t be created')
    throw new Error('Name is required to create a store')
  }

  if (stores[name]) {
    debug('Name already in use. Please use a unique name or use getStore for an existing name')
    throw new Error('Name already in use. Aborting store creation')
  }

  stores[name] = initialValue
  debug('created new store (%o) with value (%o)', name, initialValue)

  return {
    getState: getStateEntity(name),
    subscribe: subscribeEntity(name),
    dispatch: dispatchEntity(name)
  }
}

/**
 * Destroys a Store
 * @function
 * @param {string} name - The store name
 * @return {object | array} - The latest state before deletion
 */
const destroyStore = (name) => {
  if (!name) {
    debug('Name is missing, store won\'t be destroyed')
    throw new Error('Name is required for destroying a store')
  }

  if (!stores[name]) {
    debug('Store does not exist. Please use an existing name for destroying the store')
    throw new Error('Store does not exist. Please try again with a correct name for destroying the store.')
  }

  const currentStoreState = getStateEntity(name)()
  delete stores[name]
  debug('deleted store (%o)', name)

  return currentStoreState
}

/**
 * Gets a Store
 * @function
 * @param {string} name - The store name
 * @return {object} - The Store interface
 */
const getStore = (name) => {
  debug('getting store (%o)', name)
  if (!name) {
    debug('Name is missing, store won\'t be retrieved')
    throw new Error('Name is required for retrieving a store')
  }

  if (!stores[name]) {
    debug('Store does not exist. Please use an existing name for retrieving the store')
    throw new Error('Store does not exist. Please try again with a correct name.')
  }

  return {
    getState: getStateEntity(name),
    subscribe: subscribeEntity(name),
    dispatch: dispatchEntity(name)
  }
}

/**
 * Checks if the store exists
 * @function
 * @param {string} name - The store name
 * @return {boolean} - If the Store exists or not
 */
const storeExists = (name) => Boolean(stores[name])

module.exports = {
  createStore,
  destroyStore,
  getStore,
  storeExists
}
