import BeastSaber from "beastsaber-api"
import { Map } from "beastsaber-api/lib/models/Map"
import BeatSaverAPI from "beatsaver-api"
import { SortOrder } from "beatsaver-api/lib/api/search"
import { SearchResponse } from "beatsaver-api/lib/models/SearchResponse"
import { ApiTrack } from "../models/ApiTrack"
import { ApiPartnerArtist } from "../models/ApiPartnerArtist"
import { MapLocal } from "../models/MapLocal"
import URI from "../models/URI"
import { BackendRequestHandler } from "./BackendRequestHandler"
import { satisfies } from "semver"

type FilesResponse = {
	path: string
	parent: string
	dirs: string[]
	files: string[]
}

type BsDirResponse = {
	path: string
	version: string
}

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

	async getTrackMetadata(uri: URI): Promise<ApiTrack> {
		const url = `https://api.spotify.com/v1/tracks/${uri.id}`
		return (await Spicetify.CosmosAsync.get(url)) as ApiTrack
	}

	async getArtist(uri: URI): Promise<ApiPartnerArtist> {
		if ("GraphQL" in Spicetify) {
			// @ts-expect-error: not in types
			const { GraphQL } = Spicetify
			const queryArtistOverview = {
				name: "queryArtistOverview",
				operation: "query",
				sha256Hash:
					"35648a112beb1794e39ab931365f6ae4a8d45e65396d641eeda94e4003d41497",
				value: null,
			}

			const request = {
				uri: uri.toString(),
				locale: "",
				includePrerelease: false,
			}

			const data: any = await GraphQL.Request(
				queryArtistOverview,
				request,
				{
					persistCache: true,
				}
			)
			return data.artistUnion as ApiPartnerArtist
		}

		const vars = {
			uri: uri.toString(),
			locale: "",
			includePrerelease: false,
		}
		const exts = {
			persistedQuery: {
				version: 1,
				sha256Hash:
					"35648a112beb1794e39ab931365f6ae4a8d45e65396d641eeda94e4003d41497",
			},
		}
		const varsStr = encodeURIComponent(JSON.stringify(vars))
		const extsStr = encodeURIComponent(JSON.stringify(exts))
		const url = `https://api-partner.spotify.com/pathfinder/v1/query?operationName=queryArtistOverview&variables=${varsStr}&extensions=${extsStr}`
		const data: any = await Spicetify.CosmosAsync.get(url)
		return data.data.artistUnion as ApiPartnerArtist
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

	async backendGet<T>(endpoint: string): Promise<T> {
		const url = `http://${BeatSaber.Core.Settings.backendHostname}${endpoint}`
		const headers = {
			Authorization: `Basic ${BeatSaber.Core.Settings.backendAuth}`,
		}
		const response = await fetch(url, {
			method: "GET",
			headers,
		})
		return (await response.json()) as unknown as T
	}

	async backendPost<T>(endpoint: string): Promise<T> {
		const url = `http://${BeatSaber.Core.Settings.backendHostname}${endpoint}`
		const headers = {
			Authorization: `Basic ${BeatSaber.Core.Settings.backendAuth}`,
		}
		const response = await fetch(url, {
			method: "POST",
			headers,
		})
		return (await response.json()) as unknown as T
	}

	async checkBackend(): Promise<string> {
		const data = await this.backendGet<any>("/")
		if (!satisfies(data.version, ">=2.0.0")) {
			throw Error("Please update spicetify-beat-saber-backend")
		}
		return data.version
	}

	async getDownloads(): Promise<MapLocal[]> {
		return this.backendGet<MapLocal[]>("/levels")
	}

	async getDownloadHashes(): Promise<string[]> {
		return this.backendGet<string[]>("/levels/hashes")
	}

	async downloadLevel(hash: string): Promise<MapLocal> {
		return this.backendGet<MapLocal>(`/levels/download/${hash}`)
	}

	async deleteLevel(levelDir: string): Promise<string> {
		return this.backendGet<string>(
			`/levels/delete/${encodeURIComponent(levelDir)}`
		)
	}

	async listFilesInPath(path: string): Promise<FilesResponse> {
		return await this.backendGet("/files?path=" + encodeURIComponent(path))
	}

	async getBsDir(): Promise<BsDirResponse> {
		return await this.backendGet("/levels/bsdir")
	}

	async setBsDir(path: string): Promise<BsDirResponse> {
		return await this.backendPost(
			"/levels/bsdir?path=" + encodeURIComponent(path)
		)
	}
}
