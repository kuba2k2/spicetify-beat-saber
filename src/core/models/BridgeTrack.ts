export type BridgeTrack = {
	album: {
		name: string
		uri: string
	}
	artists: {
		name: string
		uri: string
		image?: string
		images?: [number, string][]
	}[]
	name: string
	image: string
	images: [number, string][]

	advertisement: boolean
	availability: string
	disc: number
	duration: number
	explicit: boolean
	linkedTrack?: string
	local: boolean
	number: number
	placeholder: boolean
	playable: boolean
}
