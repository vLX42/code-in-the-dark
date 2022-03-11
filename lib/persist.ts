import { configurePersist } from 'zustand-persist'

const { persist, purge } = configurePersist({
  storage: typeof localStorage !== 'undefined' ? localStorage : null as any,
})
export default persist
export { purge }