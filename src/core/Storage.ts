import { IDBPDatabase, openDB } from "idb"
import * as builtInLevels from "../../res/levels.json"
import { AppSchema } from "./models/AppSchema"
import { BuiltInLevel } from "./models/BuiltInLevel"
import { Track } from "./models/Track"
import { Map } from "beastsaber-api/lib/models/Map"
import { MapDetail } from "beatsaver-api/lib/models/MapDetail"
import { Level } from "./models/Level"

export enum HashType {
	NOT_INTERESTED = "hashNotInterested",
	BOOKMARKED = "hashBookmarked",
	DOWNLOADED = "hashDownloaded",
}

export class Storage {
	db: IDBPDatabase<AppSchema>

	async initialize() {
		this.db = await openDB<AppSchema>("beatsaber", 2, {
			upgrade(db, oldVersion, _newVersion, _transaction) {
				if (oldVersion < 1) {
					db.createObjectStore("track", {
						keyPath: "slug",
					})
				}
				if (oldVersion < 2) {
					db.createObjectStore("hashNotInterested")
					db.createObjectStore("hashBookmarked", {
						keyPath: "hash",
					})
					db.createObjectStore("hashDownloaded", {
						keyPath: "hash",
					})
				}
			},
		})
	}

	async getTrack(track: Track): Promise<Track | null> {
		let found = await this.readTrack(track.slug)

		if (found && track.uri !== found.uri) {
			found.uri = track.uri
		}

		if (track.slug in builtInLevels) {
			const level = builtInLevels[track.slug] as BuiltInLevel
			if (!found) found = new Track(track)
			found.builtInLevel = level
			found.maps = found.maps || []
		}

		if (found) {
			found.notInterestedHashes = await this.getHashes(
				HashType.NOT_INTERESTED,
				found
			)
			found.includeHashes.deleteAll(found.notInterestedHashes)
			found.excludeHashes.deleteAll(found.notInterestedHashes)
			found.calculateMatches()
		}
		return found
	}

	async readTrack(slug: string): Promise<Track | null> {
		const track = await this.db.get("track", slug)
		return track && new Track(track)
	}

	async putTrack(track: Track) {
		await this.db.put("track", track.getData())
	}

	async getHashes(type: HashType, track?: Track): Promise<Set<string>> {
		const hashes = await this.db.getAllKeys(type)
		if (track) {
			return track.hashes.intersect(hashes)
		}
		return new Set(hashes)
	}

	async putHashes(type: HashType, items: (Map | MapDetail | Level)[]) {
		const tx = this.db.transaction(type, "readwrite")
		for (const item of items) {
			if ("versions" in item) {
				await tx.store.put(item, item.versions[0].hash)
				continue
			}
			await tx.store.put(item)
		}
		await tx.done
	}

	async removeHashes(type: HashType, hashes: Iterable<string>) {
		const tx = this.db.transaction(type, "readwrite")
		for (const hash of hashes) {
			await tx.store.delete(hash)
		}
		await tx.done
	}
}
