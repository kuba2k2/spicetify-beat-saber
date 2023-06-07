import BeastSaber from "beastsaber-api"
import { Map } from "beastsaber-api/lib/models/Map"
import BeatSaverAPI from "beatsaver-api"
import { SortOrder } from "beatsaver-api/lib/api/search"
import { SearchResponse } from "beatsaver-api/lib/models/SearchResponse"
import { BridgeTrack } from "../models/BridgeTrack"
import { CosmosArtist } from "../models/CosmosArtist"
import { MapLocal } from "../models/MapLocal"
import { BackendRequestHandler } from "./BackendRequestHandler"

export class ApiUtils {
	BeatSaver = new BeatSaverAPI({
		AppName: "spicetify-beat-saber",
		Version: BeatSaber.Manifest.BundleVersion,
	})

	BeastSaber = new BeastSaber()

	constructor() {
		this.BeastSaber.setRequestHandler(
			new BackendRequestHandler("bsaber.com")
		)
	}

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

	async searchMaps(query: string): Promise<SearchResponse> {
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
		return await this.BeatSaver.searchMaps(params)
	}

	private async login() {
		if (!(await this.BeastSaber.isLoggedIn())) {
			await this.BeastSaber.login(
				BeatSaber.Core.Settings.bsaberLogin,
				BeatSaber.Core.Settings.bsaberPassword
			)
		}
	}

	async getBookmarks(userLogin: string, page: number): Promise<Map[]> {
		const response = await this.BeastSaber.getBookmarkedBy(userLogin, page)
		return response.maps
	}

	async getBookmarkKeys(userLogin: string): Promise<string[]> {
		const url = `https://bsaber.com/wp-json/bsaber-api/songs/?bookmarked_by=${userLogin}&page=1&count=200`
		const response = await Spicetify.CosmosAsync.get(url)
		return response["songs"].map((song: object) => song["song_key"])
	}

	async addBookmark(key: string): Promise<Map> {
		await this.login()
		const map = await this.BeastSaber.getMapByKey(key)
		await this.BeastSaber.bookmarkAdd(map.id)
		return map
	}

	async removeBookmark(id: number): Promise<void> {
		await this.login()
		await this.BeastSaber.bookmarkRemove(id)
	}

	async levelsRequest<T>(endpoint: string): Promise<T> {
		const url = `http://${BeatSaber.Core.Settings.backendHostname}/levels${endpoint}`
		const headers = {
			Authorization: `Basic ${BeatSaber.Core.Settings.backendAuth}`,
		}
		const response = await Spicetify.CosmosAsync.get(url, null, headers)
		return response as unknown as T
	}

	async getDownloads(): Promise<MapLocal[]> {
		return this.levelsRequest<MapLocal[]>("/")
	}

	async getDownloadHashes(): Promise<string[]> {
		return this.levelsRequest<string[]>("/hashes")
	}

	async downloadLevel(hash: string): Promise<MapLocal> {
		return this.levelsRequest<MapLocal>(`/download/${hash}`)
	}

	async deleteLevel(levelDir: string): Promise<void> {
		this.levelsRequest<string>(`/delete/${encodeURIComponent(levelDir)}`)
	}
}
