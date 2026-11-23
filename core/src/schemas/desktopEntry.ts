export interface DesktopEntrySchema {
    id: string
    profile_id: string
    icon_path: string | null
    filename: string
    executable: string
    args: string
    name: string
    comment: string
    categories: string
}
