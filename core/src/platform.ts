import ProfileRepository from './repositories/ProfileRepository.ts'
import ZenithService from './services/ZenithService.ts'

export default interface Platform {
    profiles: ProfileRepository
    zenith: ZenithService
}
