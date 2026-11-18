import ProfileRepository from 'core/repositories/ProfileRepository.ts'

interface Platform {
  profiles: ProfileRepository
}

declare global {
  interface Window {
    platform: Platform
  }
}
