import { Track } from "../../models/Track"
import URI from "../../models/URI"
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
		const artist = await BeatSaber.Core.Api.getArtist(track.artistURIs[0])
		const image =
			artist.visuals.headerImage ??
			artist.visuals.avatarImage ??
			artist.visuals.gallery?.items?.shift()
		track.artistImage = URI.from(image?.sources?.shift()?.url) ?? false
		return track
	}
}
