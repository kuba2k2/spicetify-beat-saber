import { BridgeTrack } from "./models/BridgeTrack"
import { CosmosArtist } from "./models/CosmosArtist"

export class BridgeUtils {
	async getTrackMetadata(uri: Spicetify.URI): Promise<BridgeTrack> {
		const track = await Spicetify.BridgeAsync.request("track_metadata", [
			uri.toString(),
		])
		return track as BridgeTrack
	}

	async getArtist(uri: Spicetify.URI): Promise<CosmosArtist> {
		const id = uri.getBase62Id()
		const catalogue = window.__spotify.product_state.catalogue
		const locale = window.__spotify.locale
		const username = window.__spotify.username
		const url = `hm://artist/v1/${id}/desktop?format=json&catalogue=${catalogue}&locale=${locale}&username=${username}&cat=1`
		return (await Spicetify.CosmosAsync.get(url)) as CosmosArtist
	}
}
