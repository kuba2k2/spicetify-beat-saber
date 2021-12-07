interface LevelPack {
	id: string
	name: string
	nameShort: string
	cover: string
	isDLC: boolean
	isOST: boolean
}

export interface BuiltInLevel {
	id: string
	songName: string
	songSubName: string
	songAuthorName: string
	levelAuthorName: string
	cover: string
	pack: LevelPack
}
