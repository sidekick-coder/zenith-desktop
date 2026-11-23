export interface ReleaseSchema {
    tagName: string
    name: string
    publishedAt: string | null
    downloaded: boolean
    assets: Array<{
        name: string
        downloadUrl: string
    }>
}
