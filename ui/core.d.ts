import Platform from 'core/platform.ts'

declare global {
  interface Window {
    platform: Platform
  }
}
