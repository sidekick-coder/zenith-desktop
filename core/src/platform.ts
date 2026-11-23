import ProfileRepository from './repositories/ProfileRepository.ts'
import ServerRepository from './repositories/ServerRepository.ts'
import ZenithService from './services/ZenithService.ts'

export default interface Platform {
    profiles: ProfileRepository
    servers: ServerRepository
    zenith: ZenithService
}
