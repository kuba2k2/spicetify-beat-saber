import { Track } from "../../models/Track"
import URI from "../../models/URI"
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
		const metadata = await BeatSaber.Core.Api.getTrackMetadata(track.uri)

		track.title = metadata.name
		track.artists = metadata.artists?.map((artist) => artist.name)
		track.artistURIs = metadata.artists?.map((artist) =>
			URI.from(artist.uri)
		)
		track.album = metadata.album?.name
		track.albumUri = URI.from(metadata.album?.uri)
		let maxSize = 0
		for (const image of metadata.album?.images ?? []) {
			if (image.width > maxSize) {
				track.imageUri = URI.from(image.url)
				maxSize = image.width
			}
		}
		return track
	}
}
