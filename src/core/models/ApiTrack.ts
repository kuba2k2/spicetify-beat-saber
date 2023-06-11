export type ApiTrack = {
	album: {
		name: string
		uri: string
		images: {
			width: number
			height: number
			url: string
		}[]
	}
	artists: {
		name: string
		uri: string
	}[]
	name: string
	uri: string
}
