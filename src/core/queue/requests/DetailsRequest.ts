import { Track } from "../../models/Track"
import { TrackQueueRequest } from "../base/TrackQueueRequest"

export class DetailsRequest extends TrackQueueRequest {
	constructor(init: object) {
		super(init)
		this.type = "DetailsRequest"
	}

	requestShouldRun(track: Track): boolean {
		return !track.imageUri
	}

	async run(track: Track): Promise<Track> {
		const metadata = await BeatSaber.Bridge.getTrackMetadata(track.uri)

		track.title = metadata.name
		track.artists = metadata.artists?.map((artist) => artist.name)
		track.artistURIs = metadata.artists?.map((artist) =>
			Spicetify.URI.fromString(artist.uri)
		)
		track.album = metadata.album?.name
		track.albumUri = Spicetify.URI.fromString(metadata.album?.uri)
		track.imageUri = Spicetify.URI.fromString(metadata.image)
		return track
	}
}
