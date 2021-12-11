import { MapDetail } from "beatsaver-api/lib/models/MapDetail"
import { BuiltInLevel } from "./BuiltInLevel"
import { getSlug } from "../utils"
import { TrackDB } from "./TrackDB"

export enum TrackState {
	DEFAULT = "DEFAULT",
	ENQUEUED = "ENQUEUED",
	SEARCHING = "SEARCHING",
	BUILT_IN = "BUILT_IN",
	NOT_INTERESTED = "NOT_INTERESTED",

	/**
	 * The search returned no results, and was confirmed by the user.
	 */
	MAPS_NO_RESULTS = "MAPS_NO_RESULTS",
	/**
	 * The search returned no results.
	 */
	MAPS_NO_RESULTS_NEW = "MAPS_NO_RESULTS_NEW",
	/**
	 * All results were excluded by the user.
	 */
	MAPS_EXCLUDED = "MAPS_EXCLUDED",
	/**
	 * All results were marked as not-interested.
	 */
	MAPS_NOT_INTERESTED = "MAPS_NOT_INTERESTED",
	/**
	 * The search returned possible, unconfirmed map matches.
	 */
	MAPS_POSSIBLE = "MAPS_POSSIBLE",
	/**
	 * All the matched maps are confirmed by the user.
	 */
	MAPS_MATCHED = "MAPS_MATCHED",
	/**
	 * The search returned automatically matched maps.
	 */
	MAPS_MATCHED_NEW = "MAPS_MATCHED_NEW",

	/**
	 * One of the matched maps was bookmarked.
	 */
	BOOKMARKED = "BOOKMARKED",
	/**
	 * One of the matched maps is currently being downloaded.
	 */
	DOWNLOADING = "DOWNLOADING",
	/**
	 * One of the matched maps is downloaded already.
	 */
	DOWNLOADED = "DOWNLOADED",
}

export class Track extends TrackDB {
	builtInLevel: BuiltInLevel = null

	/**
	 * All map hashes.
	 */
	hashes: Set<string> = new Set()
	/**
	 * All map keys (hex IDs).
	 */
	keys: Set<string> = new Set()

	/**
	 * Unreviewed maps, matched automatically.
	 */
	matchHashes: Set<string> = new Set()
	/**
	 * Unreviewed maps, not matched but returned by the query.
	 */
	possibleMatchHashes: Set<string> = new Set()
	/**
	 * Maps marked as not-interested, read from the database.
	 */
	notInterestedHashes: Set<string> = new Set()

	bookmarkedKeys: Set<string> = new Set()
	downloadedHashes: Set<string> = new Set()

	state: TrackState = TrackState.DEFAULT

	private hasBookmarked = false
	private hasDownloaded = false

	constructor(init: Partial<Track>) {
		super()
		Object.assign(this, init)
		this.uri = Spicetify.URI.from(this.uri)
		this.slug = getSlug(this.getDefaultSearchQuery())
		this.artistURIs = this.artistURIs.map((uri) => Spicetify.URI.from(uri))
		this.artistImage = Spicetify.URI.from(this.artistImage)
		this.albumUri = Spicetify.URI.from(this.albumUri)
		this.imageUri = Spicetify.URI.from(this.imageUri)
		this.extractHashes()
		// this.includeHashes = new Set()
	}

	public getArtist(): string {
		return this.artists[0]
	}

	public getTitle(): string {
		return this.title
	}

	public getDefaultSearchQuery(): string {
		const title = this.getTitle()
			.replace(/\(.+?\)/, "")
			.replace(/\[.+?\]/, "")
			.trim()
		return `${this.getArtist()} ${title}`
	}

	public getSearchQuery(): string {
		return this.userQuery ?? this.getDefaultSearchQuery()
	}

	public getFullTitle(): string {
		return `${this.getArtist()} - ${this.getTitle()}`
	}

	public getData(): TrackDB {
		return {
			uri: this.uri,
			slug: this.slug,
			title: this.title,
			artists: this.artists,
			artistURIs: this.artistURIs,
			artistImage: this.artistImage,
			album: this.album,
			albumUri: this.albumUri,
			imageUri: this.imageUri,
			userQuery: this.userQuery,
			maps: this.maps,
			includeHashes: this.includeHashes,
			excludeHashes: this.excludeHashes,
			reviewed: this.reviewed,
			notInterested: this.notInterested,
		}
	}

	/**
	 * Get all matched maps' hashes, whether confirmed by the user or not.
	 */
	get allMatchHashes(): Set<string> {
		return this.matchHashes.concat(this.includeHashes)
	}

	/**
	 * Get all matched maps count, whether confirmed by the user or not.
	 */
	get allMatchCount(): number {
		return this.includeHashes.size + this.matchHashes.size
	}

	get possibleMatchCount(): number {
		return this.possibleMatchHashes.size
	}

	private mapMatches(map: MapDetail): boolean {
		const name = [
			map.metadata.songAuthorName,
			map.metadata.songName,
			map.metadata.songSubName,
			map.name,
		]
			.join(" ")
			.toLowerCase()
		const artist = this.getArtist().toLowerCase()
		const title = this.getTitle().toLowerCase()
		return name.includes(artist) && name.includes(title)
	}

	public extractHashes() {
		this.hashes = new Set(
			this.maps?.map((map) => map.versions[0].hash) ?? []
		)
		this.keys = new Set(this.maps?.map((map) => map.id) ?? [])
	}

	public calculateMatches() {
		this.matchHashes.clear()
		this.possibleMatchHashes.clear()

		const matchKeys = new Set<string>()

		this.maps?.forEach((map) => {
			const hash = map.versions[0].hash
			const included = this.includeHashes.has(hash)
			const excluded = this.excludeHashes.has(hash)
			const notInterested = this.notInterestedHashes.has(hash)
			if (included) {
				matchKeys.add(map.id)
			}
			if (included || excluded || notInterested) {
				return
			}
			if (this.mapMatches(map)) {
				this.matchHashes.add(hash)
				matchKeys.add(map.id)
			} else {
				this.possibleMatchHashes.add(hash)
			}
		})

		const matchHashes = this.allMatchHashes
		this.hasBookmarked = matchKeys.hasAny(this.bookmarkedKeys)
		this.hasDownloaded = matchHashes.hasAny(this.downloadedHashes)
		this.calculateState()
	}

	public calculateState(unlock?: boolean) {
		if (!unlock && this.state === TrackState.SEARCHING) {
			return
		}

		if (this.maps == null) {
			this.state = TrackState.ENQUEUED
		} else if (this.hasDownloaded) {
			this.state = TrackState.DOWNLOADED
		} else if (this.hasBookmarked) {
			this.state = TrackState.BOOKMARKED
		} else if (this.builtInLevel) {
			this.state = TrackState.BUILT_IN
		} else if (this.notInterested) {
			this.state = TrackState.NOT_INTERESTED
		} else if (this.matchHashes.size) {
			this.state = TrackState.MAPS_MATCHED_NEW
		} else if (this.includeHashes.size) {
			this.state = TrackState.MAPS_MATCHED
		} else if (this.possibleMatchHashes.size) {
			this.state = TrackState.MAPS_POSSIBLE
		} else if (this.notInterestedHashes.size) {
			this.state = TrackState.MAPS_NOT_INTERESTED
		} else if (this.excludeHashes.size) {
			this.state = TrackState.MAPS_EXCLUDED
		} else {
			this.state = this.reviewed
				? TrackState.MAPS_NO_RESULTS
				: TrackState.MAPS_NO_RESULTS_NEW
		}
	}
}
