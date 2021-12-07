import { Track } from "../../models/Track"
import { QueueRequest } from "./QueueRequest"

export class ArtistImageRequest extends QueueRequest {
	constructor(init: object) {
		super(init)
		this.type = "ArtistImageRequest"
	}

	requestShouldRun(track: Track): boolean {
		return !track.artistImage && track.artistImage !== false
	}

	async run(track: Track): Promise<Track> {
		const artist = await BeatSaber.Bridge.getArtist(track.artistURIs[0])
		let image =
			artist.header_image?.image ?? artist.info.portraits?.shift()?.uri
		image = image?.replace("https://i.scdn.co/image/", "spotify:image:")
		track.artistImage = Spicetify.URI.from(image) ?? false
		return track
	}
}
