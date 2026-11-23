import ProfileRepository from './repositories/ProfileRepository.ts'
import NodeRepository from './repositories/NodeRepository.ts'
import ReleaseRepository from './repositories/ReleaseRepository.ts'
import DesktopEntryService from './services/DesktopEntryService.ts'
import ServerRepository from './repositories/ServerRepository.ts'
import ZenithService from './services/ZenithService.ts'
import type { DesktopEntrySchema } from './schemas/desktopEntry.ts'

type DesktopEntryPlatform = DesktopEntryService & {
    generate(entry: DesktopEntrySchema): Promise<string>
    list(): Promise<DesktopEntrySchema[]>
    createEmpty(): Promise<DesktopEntrySchema>
    createControlPanel(): Promise<DesktopEntrySchema>
    findOne(filter: { id?: string; profile_id?: string }): Promise<DesktopEntrySchema | null>
    updateById(id: string, payload: Partial<Omit<DesktopEntrySchema, "id">>): Promise<DesktopEntrySchema>
    deleteById(id: string): Promise<void>
}

export default interface Platform {
    desktopEntries: DesktopEntryPlatform
    profiles: ProfileRepository
    nodes: NodeRepository
    releases: ReleaseRepository
    servers: ServerRepository
    zenith: ZenithService
}
