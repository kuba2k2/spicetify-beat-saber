import { IDBPDatabase, openDB } from "idb"

import { AppSchema } from "../models/AppSchema"
import { TrackStorage } from "./TrackStorage"
import { MapStorage } from "./MapStorage"

export class Storage {
	db: IDBPDatabase<AppSchema>

	Track: TrackStorage
	Map: MapStorage

	async initialize() {
		this.db = await openDB<AppSchema>("beatsaber", 3, {
			upgrade(db, oldVersion, _newVersion, _transaction) {
				if (oldVersion < 1) {
					db.createObjectStore("track", {
						keyPath: "slug",
					})
				}
				if (oldVersion < 2) {
					db.createObjectStore("hashNotInterested")
					// @ts-expect-error
					db.createObjectStore("hashBookmarked", {
						keyPath: "hash",
					})
					db.createObjectStore("hashDownloaded", {
						keyPath: "hash",
					})
				}
				if (oldVersion < 3) {
					// @ts-expect-error
					db.deleteObjectStore("hashBookmarked")
					db.createObjectStore("keyBookmarked", {
						keyPath: "key",
					})
				}
			},
		})

		this.Track = new TrackStorage(this.db, this)
		this.Map = new MapStorage(this.db, this)
	}
}
