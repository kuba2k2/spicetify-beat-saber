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
		console.log("Bookmark", this.type, "by key", this.key)

		if (
			!BeatSaber.Settings.bsaberLogin ||
			!BeatSaber.Settings.bsaberPassword
		) {
			throw new QueueError("BeastSaber login data missing")
		}

		let map: Map
		switch (this.type) {
			case MapQueueRequestType.ADD:
				map = await BeatSaber.Api.addBookmark(this.key)
				await BeatSaber.Storage.Map.put(category, map)
				break
			case MapQueueRequestType.REMOVE:
				map = (await BeatSaber.Storage.Map.get(
					category,
					this.key
				)) as Map
				await BeatSaber.Api.removeBookmark(map.id)
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
			track.calculateMatches()
			subject.next(track)
		}

		this.resolve()
	}
}
