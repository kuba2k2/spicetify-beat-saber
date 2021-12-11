import { Map } from "beastsaber-api/lib/models/Map"
import { MapCategory } from "../../storage/MapStorage"
import { MapQueueRequest, MapQueueRequestType } from "../base/MapQueueRequest"
import { QueueError } from "../base/QueueError"

export class BookmarkRequest extends MapQueueRequest {
	key: string

	constructor(key: string, type: MapQueueRequestType) {
		super()
		this.name = `BookmarkRequest(${key}, ${type})`
		this.type = type
		this.key = key
	}

	async run() {
		const category = MapCategory.BOOKMARKED
		let map: Map
		console.log("Bookmark", this.type, "by key", this.key)

		switch (this.type) {
			case MapQueueRequestType.ADD:
				map = await BeatSaber.Bsaber.getMapByKey(this.key)
				// TODO add bookmark by map.id
				await BeatSaber.Storage.Map.put(category, map)
				break
			case MapQueueRequestType.REMOVE:
				map = (await BeatSaber.Storage.Map.get(
					category,
					this.key
				)) as Map
				// TOOD remove bookmark by map.id
				await BeatSaber.Storage.Map.remove(category, this.key)
				break
		}

		const subjects = BeatSaber.TrackQueue.getSubjectsByKey(this.key)
		for (const subject of subjects) {
			const track = subject.value
			switch (this.type) {
				case MapQueueRequestType.ADD:
					track.bookmarkedKeys.add(this.key)
					break
				case MapQueueRequestType.REMOVE:
					track.bookmarkedKeys.delete(this.key)
					break
			}
			track.calculateState()
			subject.next(track)
		}

		this.resolve()
	}
}
