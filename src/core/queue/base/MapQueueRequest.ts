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
	public reject: (reason: Error) => void
	protected type: MapQueueRequestType

	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		})
	}

	requestShouldRun(): boolean {
		return true
	}

	abstract run(): Promise<void>
}
