export enum MapQueueRequestType {
	OTHER = "OTHER",
	ADD = "ADD",
	REMOVE = "REMOVE",
}

export abstract class MapQueueRequest {
	name: string
	postRunDelay = 500

	readonly promise: Promise<void>
	protected resolve: () => void
	protected type: MapQueueRequestType

	constructor() {
		this.promise = new Promise((resolve) => {
			this.resolve = resolve
		})
	}

	requestShouldRun(): boolean {
		return true
	}

	abstract run(): Promise<void>
}
