import ProfileRepository from './repositories/ProfileRepository.ts'
import NodeRepository from './repositories/NodeRepository.ts'
import ReleaseRepository from './repositories/ReleaseRepository.ts'
import DesktopEntryService from './services/DesktopEntryService.ts'
import type { MakePayload } from './services/DesktopEntryService.ts'
import ServerRepository from './repositories/ServerRepository.ts'
import ZenithService from './services/ZenithService.ts'
import type { DesktopEntrySchema } from './schemas/desktopEntry.ts'
import type { ProfileSchema } from './schemas/profile.ts'

type DesktopEntryPlatform = DesktopEntryService & {
    make(payload?: MakePayload): Promise<DesktopEntrySchema>
    create(entry: DesktopEntrySchema): Promise<DesktopEntrySchema>
    generate(entry: DesktopEntrySchema): Promise<string>
    list(): Promise<DesktopEntrySchema[]>
    findOne(filter: { id?: string; profile_id?: string }): Promise<DesktopEntrySchema | null>
    updateById(id: string, payload: Partial<Omit<DesktopEntrySchema, "id">>): Promise<DesktopEntrySchema>
    deleteById(id: string): Promise<void>
}

type ProfilePlatform = ProfileRepository & {
    selectIcon(id: string): Promise<ProfileSchema | null>
}

export default interface Platform {
    desktopEntries: DesktopEntryPlatform
    profiles: ProfilePlatform
    nodes: NodeRepository
    releases: ReleaseRepository
    servers: ServerRepository
    zenith: ZenithService
}
