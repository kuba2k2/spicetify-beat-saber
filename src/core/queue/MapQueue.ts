import { MapDetail } from "beatsaver-api/lib/models/MapDetail"
import { MapQueueRequest, MapQueueRequestType } from "./base/MapQueueRequest"
import { BookmarkRequest } from "./requests/BookmarkRequest"
import { DownloadRequest } from "./requests/DownloadRequest"

export class MapQueue {
	private queue: MapQueueRequest[] = []
	private queueRunning = false

	private log(...data: unknown[]) {
		if (BeatSaber.Core.Settings.logMapQueue) {
			console.log("[MapQueue]", ...data)
		}
	}

	private enqueue(request: MapQueueRequest) {
		if (!request.requestShouldRun()) {
			this.log("Enqueue: skipping", request.name)
			return
		}
		// remove duplicated requests
		this.queue = this.queue.filter((item) => item.name !== request.name)
		// insert at the end of the queue
		this.queue.push(request)
		// run the queue
		this.runQueue()
	}

	private async runQueue(fromTimeout?: boolean) {
		if (!fromTimeout && this.queueRunning) {
			return
		}
		if (this.queue.length === 0) {
			this.queueFinish()
			return
		}
		if (!this.queueRunning) {
			this.log("Run: Queue started")
		}
		this.queueRunning = true

		const request = this.queue.shift()
		if (!request) {
			this.queueFinish()
			return
		}

		let delay = request.postRunDelay

		if (!request.requestShouldRun()) {
			this.log("Run: skipping", request.name)
			delay = 0
		} else {
			this.log("Run: executing", request.name)

			// execute the request and emit to subscribers
			try {
				await request.run()
			} catch (e) {
				console.error("Map queue error", e)
				BeatSaber.Core.ErrorSubject.next(e)
				request.reject(e)
				this.queueNext(0)
				return
			}
		}

		this.queueNext(delay)
	}

	private queueFinish() {
		this.log("Run: Queue finished")
		this.queueRunning = false
	}

	private queueNext(delay: number) {
		if (!delay) {
			this.runQueue(true)
			return
		}
		setTimeout(() => {
			this.runQueue(true)
		}, delay)
	}

	bookmarkAdd(map: MapDetail): Promise<void> {
		const request = new BookmarkRequest(map.id, MapQueueRequestType.ADD)
		this.enqueue(request)
		return request.promise
	}

	bookmarkRemove(map: MapDetail): Promise<void> {
		const request = new BookmarkRequest(map.id, MapQueueRequestType.REMOVE)
		this.enqueue(request)
		return request.promise
	}

	downloadAdd(map: MapDetail): Promise<void> {
		const request = new DownloadRequest(
			map.versions[0].hash,
			MapQueueRequestType.ADD
		)
		this.enqueue(request)
		return request.promise
	}

	downloadRemove(map: MapDetail): Promise<void> {
		const request = new DownloadRequest(
			map.versions[0].hash,
			MapQueueRequestType.REMOVE
		)
		this.enqueue(request)
		return request.promise
	}
}
