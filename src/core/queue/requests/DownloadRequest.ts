import { Level } from "../../models/Level"
import { MapCategory } from "../../storage/MapStorage"
import { MapQueueRequest, MapQueueRequestType } from "../base/MapQueueRequest"

export class DownloadRequest extends MapQueueRequest {
	hash: string

	constructor(hash: string, type: MapQueueRequestType) {
		super()
		this.name = `DownloadRequest(${hash}, ${type})`
		this.type = type
		this.hash = hash
	}

	async run() {
		const category = MapCategory.DOWNLOADED
		let level: Level
		console.log("Download", this.type, "by hash", this.hash)

		switch (this.type) {
			case MapQueueRequestType.ADD:
				// TODO download level by this.hash
				await BeatSaber.Storage.Map.put(category, level)
				break
			case MapQueueRequestType.REMOVE:
				level = (await BeatSaber.Storage.Map.get(
					category,
					this.hash
				)) as Level
				// TODO remove download by level.levelDir
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
			track.calculateState()
			subject.next(track)
		}

		this.resolve()
	}
}
