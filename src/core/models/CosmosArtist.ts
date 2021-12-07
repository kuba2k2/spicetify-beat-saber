export type CosmosArtist = {
	uri: string
	info: {
		uri: string
		name: string
		portraits?: {
			uri: string
		}[]
		verified: boolean
	}
	header_image: {
		image: string
		offset: number
	}
}
