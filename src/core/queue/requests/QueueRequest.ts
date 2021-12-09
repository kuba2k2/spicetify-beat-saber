import { Track } from "../../models/Track"

export abstract class QueueRequest {
	type: string
	slug: string
	postRunDelay: number = 500

	requestShouldRun(_track: Track): boolean {
		return true
	}

	requestWasEnqueued(_track: Track): boolean {
		return false
	}

	requestWillRun(_track: Track): boolean {
		return false
	}

	abstract run(_track: Track): Promise<Track>

	constructor(init: object) {
		Object.assign(this, init)
	}
}
