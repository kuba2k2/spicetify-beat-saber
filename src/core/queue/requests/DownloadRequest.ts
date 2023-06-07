import { MapLocal } from "../../models/MapLocal"
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
		if (!BeatSaber.Core.Settings.backendHostname) {
			throw new QueueError("Backend is not configured")
		}

		const category = MapCategory.DOWNLOADED
		let level: MapLocal
		switch (this.type) {
			case MapQueueRequestType.ADD:
				level = await BeatSaber.Core.Api.downloadLevel(this.hash)
				await BeatSaber.Core.Storage.Map.put(category, level)
				break
			case MapQueueRequestType.REMOVE:
				level = (await BeatSaber.Core.Storage.Map.get(
					category,
					this.hash
				)) as MapLocal
				await BeatSaber.Core.Api.deleteLevel(level.levelDir)
				break
		}

		const subjects = BeatSaber.Core.TrackQueue.getSubjectsByHash(this.hash)
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
