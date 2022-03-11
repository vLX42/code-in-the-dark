import { configurePersist } from 'zustand-persist'

const { persist, purge } = configurePersist({
  storage: typeof localStorage !== 'undefined' ? localStorage : null,
})
export default persist
export { purge }