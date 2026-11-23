import ProfileRepository from './repositories/ProfileRepository.ts'
import NodeRepository from './repositories/NodeRepository.ts'
import ReleaseRepository from './repositories/ReleaseRepository.ts'
import ServerRepository from './repositories/ServerRepository.ts'
import ZenithService from './services/ZenithService.ts'

export default interface Platform {
    profiles: ProfileRepository
    nodes: NodeRepository
    releases: ReleaseRepository
    servers: ServerRepository
    zenith: ZenithService
}
