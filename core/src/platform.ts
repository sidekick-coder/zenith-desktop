import ProfileRepository from './repositories/ProfileRepository.ts'
import NodeRepository from './repositories/NodeRepository.ts'
import ServerRepository from './repositories/ServerRepository.ts'
import ZenithService from './services/ZenithService.ts'

export default interface Platform {
    profiles: ProfileRepository
    nodes: NodeRepository
    servers: ServerRepository
    zenith: ZenithService
}
