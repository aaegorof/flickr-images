interface Urls {
    url: Array<{type: string, _content: string}>
}
interface Tags {
    tag: string[]
}
interface Dates {
    posted: string
    taken: string
    takengranularity: number
    takenunknown: string
    lastupdate: string
}

interface ImageInfo {
    id: string
    secret: string
    server: string
    farm: number
    dateuploaded: string
    isfavorite: number
    license: string
    safety_level: string
    rotation: number
    originalsecret: string
    originalformat: string
    title: {
        _content: string
    }
    description: {
        _content: string
    }
    urls: Urls
    tags: Tags
    date: Dates
}


export * from "./ImageEdges";
