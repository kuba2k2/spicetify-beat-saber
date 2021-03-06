import { Level } from "../../models/Level"
import { MapCategory } from "../../storage/MapStorage"
import { MapQueueRequest, MapQueueRequestType } from "../base/MapQueueRequest"
import { QueueError } from "../base/QueueError"

export class DownloadRequest extends MapQueueRequest {
	hash: string

	constructor(hash: string, type: MapQueueRequestType) {
		super()
		this.name = `DownloadRequest(${hash}, ${type})`
		this.type = type
		this.hash = hash
	}

	async run() {
		if (!BeatSaber.Settings.backendHostname) {
			throw new QueueError("Backend is not configured")
		}

		const category = MapCategory.DOWNLOADED
		let level: Level
		switch (this.type) {
			case MapQueueRequestType.ADD:
				level = await BeatSaber.Api.downloadLevel(this.hash)
				await BeatSaber.Storage.Map.put(category, level)
				break
			case MapQueueRequestType.REMOVE:
				level = (await BeatSaber.Storage.Map.get(
					category,
					this.hash
				)) as Level
				await BeatSaber.Api.deleteLevel(level.levelDir)
				break
		}

		const subjects = BeatSaber.TrackQueue.getSubjectsByHash(this.hash)
		for (const subject of subjects) {
			const track = subject.value
			switch (this.type) {
				case MapQueueRequestType.ADD:
					track.downloadedHashes.add(this.hash)
					break
				case MapQueueRequestType.REMOVE:
					track.downloadedHashes.delete(this.hash)
					break
			}
			track.calculateMatches()
			subject.next(track)
		}

		this.resolve()
	}
}
