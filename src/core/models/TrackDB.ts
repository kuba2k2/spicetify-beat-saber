import { MapDetail } from "beatsaver-api/lib/models/MapDetail"
import URI from "./URI"

export class TrackDB {
	uri: URI
	slug: string
	title: string
	artists: string[]

	artistURIs: URI[] = []
	artistImage: URI | false = null
	album: string = null
	albumUri: URI = null
	imageUri: URI = null

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
