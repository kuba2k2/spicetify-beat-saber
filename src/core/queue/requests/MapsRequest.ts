import { Track, TrackState } from "../../models/Track"
import { TrackQueueRequest } from "../base/TrackQueueRequest"

export class MapsRequest extends TrackQueueRequest {
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
		const response = await BeatSaber.Core.Api.searchMaps(query)
		track.maps = response.docs
		track.userQuery = this.userQuery
		track.extractHashes()
		await BeatSaber.Core.Storage.Map.fillTrack(track)
		track.calculateMatches()
		return track
	}
}
