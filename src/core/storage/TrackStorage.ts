import { IDBPDatabase } from "idb"
import * as builtInLevels from "../../../res/levels.json"
import { AppSchema } from "../models/AppSchema"
import { MapOst } from "../models/MapOst"
import { Track } from "../models/Track"
import { Storage } from "./Storage"

export class TrackStorage {
	db: IDBPDatabase<AppSchema>
	storage: Storage

	constructor(db: IDBPDatabase<AppSchema>, storage: Storage) {
		this.db = db
		this.storage = storage
	}

	async get(track: Track): Promise<Track | null> {
		let found = await this.read(track.slug)

		if (found && track.uri !== found.uri) {
			found.uri = track.uri
		}

		if (track.slug in builtInLevels) {
			const level = builtInLevels[track.slug] as MapOst
			if (!found) found = new Track(track)
			found.builtInLevel = level
			found.maps = found.maps || []
		}

		if (found) {
			await BeatSaber.Core.Storage.Map.fillTrack(found)
			found.includeHashes.deleteAll(found.notInterestedHashes)
			found.excludeHashes.deleteAll(found.notInterestedHashes)
			found.calculateMatches()
		}
		return found
	}

	async read(slug: string): Promise<Track | null> {
		const track = await this.db.get("track", slug)
		return track && new Track(track)
	}

	async put(track: Track) {
		await this.db.put("track", track.getData())
	}
}
