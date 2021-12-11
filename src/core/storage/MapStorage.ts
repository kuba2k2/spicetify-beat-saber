import { IDBPDatabase } from "idb"
import { AppSchema, MapType } from "../models/AppSchema"
import { Track } from "../models/Track"
import { Storage } from "./Storage"

export enum MapCategory {
	NOT_INTERESTED = "hashNotInterested",
	BOOKMARKED = "keyBookmarked",
	DOWNLOADED = "hashDownloaded",
}

export class MapStorage {
	db: IDBPDatabase<AppSchema>
	storage: Storage

	constructor(db: IDBPDatabase<AppSchema>, storage: Storage) {
		this.db = db
		this.storage = storage
	}

	async fillTrack(track: Track) {
		track.notInterestedHashes = await this.getKeys(
			MapCategory.NOT_INTERESTED,
			track.hashes
		)
		track.bookmarkedKeys = await this.getKeys(
			MapCategory.BOOKMARKED,
			track.keys
		)
		track.downloadedHashes = await this.getKeys(
			MapCategory.DOWNLOADED,
			track.hashes
		)
	}

	async getKeys(
		cat: MapCategory,
		matching?: Set<string>
	): Promise<Set<string>> {
		const hashes = await this.db.getAllKeys(cat)
		if (matching) {
			return matching.intersect(hashes)
		}
		return new Set(hashes)
	}

	async get(cat: MapCategory, key: string): Promise<MapType | undefined> {
		return await this.db.get(cat, key)
	}

	async put(cat: MapCategory, ...items: MapType[]) {
		const tx = this.db.transaction(cat, "readwrite")
		for (const item of items) {
			if ("versions" in item) {
				await tx.store.put(item, item.versions[0].hash)
				continue
			}
			await tx.store.put(item)
		}
		await tx.done
	}

	async remove(cat: MapCategory, keys: Iterable<string>) {
		const tx = this.db.transaction(cat, "readwrite")
		for (const key of keys) {
			await tx.store.delete(key)
		}
		await tx.done
	}
}
