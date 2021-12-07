import { MapDetail } from "beatsaver-api/lib/models/MapDetail"

export class TrackDB {
	uri: Spicetify.URI
	slug: string
	title: string
	artists: string[]

	artistURIs: Spicetify.URI[] = []
	artistImage: Spicetify.URI | false = null
	album: string = null
	albumUri: Spicetify.URI = null
	imageUri: Spicetify.URI = null

	userQuery: string = null
	maps: MapDetail[] = null

	/**
	 * Maps reviewed and accepted by the user.
	 */
	includeHashes: Set<string> = new Set()
	/**
	 * Maps reviewed and discarded by the user.
	 */
	excludeHashes: Set<string> = new Set()
	reviewed: boolean
	notInterested: boolean
}
