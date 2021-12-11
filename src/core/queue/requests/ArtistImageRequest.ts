import { Track } from "../../models/Track"
import { TrackQueueRequest } from "../base/TrackQueueRequest"

export class ArtistImageRequest extends TrackQueueRequest {
	constructor(init: object) {
		super(init)
		this.type = "ArtistImageRequest"
	}

	requestShouldRun(track: Track): boolean {
		return !track.artistImage && track.artistImage !== false
	}

	async run(track: Track): Promise<Track> {
		const artist = await BeatSaber.Api.getArtist(track.artistURIs[0])
		let image =
			artist.header_image?.image ?? artist.info.portraits?.shift()?.uri
		image = image?.replace("https://i.scdn.co/image/", "spotify:image:")
		track.artistImage = Spicetify.URI.from(image) ?? false
		return track
	}
}
