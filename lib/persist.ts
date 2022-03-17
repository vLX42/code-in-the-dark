import { configurePersist } from 'zustand-persist'

const dummyStorageApi = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

const { persist, purge } = configurePersist({
  storage: typeof localStorage !== 'undefined' ? localStorage : dummyStorageApi,
})
export default persist
export { purge }