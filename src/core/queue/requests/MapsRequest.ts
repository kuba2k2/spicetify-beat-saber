import { SortOrder } from "beatsaver-api/lib/api/search"
import { Track, TrackState } from "../../models/Track"
import { HashType } from "../../Storage"
import { QueueRequest } from "./QueueRequest"

export class MapsRequest extends QueueRequest {
	userQuery?: string

	constructor(init: object) {
		super(init)
		this.type = "MapsRequest"
		this.postRunDelay = 2000
	}

	requestWasEnqueued(track: Track): boolean {
		// send to indicate queued state
		track.maps = null
		track.state = TrackState.ENQUEUED
		return true
	}

	requestWillRun(track: Track): boolean {
		// indicate searching state, also lock the state
		track.maps = null
		track.state = TrackState.SEARCHING
		return true
	}

	async run(track: Track): Promise<Track> {
		const query = this.userQuery || track.getDefaultSearchQuery()
		// because the API encodes the parameters twice
		const params = {
			sortOrder: SortOrder.Relevance,
			get q() {
				return query
			},
			set q(_value) {
				false
			},
		}
		const response = await BeatSaber.Api.searchMaps(params)
		track.maps = response.docs
		track.userQuery = this.userQuery
		track.extractHashes()
		track.notInterestedHashes = await BeatSaber.Storage.getHashes(
			HashType.NOT_INTERESTED,
			track
		)
		track.calculateMatches()
		return track
	}
}
