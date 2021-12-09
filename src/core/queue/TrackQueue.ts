import { BehaviorSubject, finalize, Observable, shareReplay } from "rxjs"
import { Track } from "../models/Track"
import { HashType } from "../Storage"
import { ArtistImageRequest } from "./requests/ArtistImageRequest"
import { DetailsRequest } from "./requests/DetailsRequest"
import { MapsRequest } from "./requests/MapsRequest"
import { QueueRequest } from "./requests/QueueRequest"

export type QueueState = {
	current?: QueueRequest
	enqueued?: QueueRequest[]
	blocked?: boolean
}

export class TrackQueue {
	private subjects: Map<string, BehaviorSubject<Track>>
	private observables: Map<string, Observable<Track>>
	private queue: QueueRequest[]
	private queueRunning = false
	private queueCleared = false
	private queueResolve = () => null

	queueSubject: BehaviorSubject<QueueState>

	constructor() {
		this.finalize = this.finalize.bind(this)
		this.queueUnblock = this.queueUnblock.bind(this)
		this.subjects = new Map()
		this.observables = new Map()
		this.queue = []
		this.queueSubject = new BehaviorSubject({
			enqueued: [],
			blocked: false,
		})
	}

	private log(...data: unknown[]) {
		if (BeatSaber.Settings.logQueue) {
			console.log(...data)
		}
	}

	private queueBlock(): Promise<void> {
		return new Promise((resolve) => {
			console.warn("[TrackQueue] Queue blocked")
			this.queueResolve = resolve
			this.queueSubject.next({ blocked: true })
		})
	}

	public queueUnblock() {
		this.queueResolve()
		this.queueSubject.next({ blocked: false })
	}

	private getSubject(slug: string): BehaviorSubject<Track> | undefined {
		return this.subjects.get(slug)
	}

	private getObservable(slug: string): Observable<Track> | undefined {
		return this.observables.get(slug)
	}

	getTrack(slug: string): Track | undefined {
		return this.getSubject(slug)?.value
	}

	private emit(track: Track) {
		const subject = this.getSubject(track.slug)
		this.log("[TrackQueue] Emit", track.slug, "with state", track.state)
		subject?.next(track)
	}

	private enqueue(request: QueueRequest, atStart?: boolean) {
		const track = this.getTrack(request.slug)
		if (!request.requestShouldRun(track)) {
			this.log("[TrackQueue] Enqueue: skipping", track.slug)
			return
		}

		// remove duplicated requests
		this.queue = this.queue.filter(
			(item) => item.slug !== request.slug || item.type !== request.type
		)

		if (atStart) {
			// insert at the beginning of the queue
			this.queue.unshift(request)
		} else {
			// insert at the end of the queue
			this.queue.push(request)
		}

		if (request.requestWasEnqueued(track)) {
			this.emit(track)
		}

		// emit queue changes
		this.queueSubject.next({ enqueued: this.queue })

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
			this.log("[TrackQueue] Run: Queue started")
		}
		this.queueRunning = true

		const request = this.queue.shift()
		if (!request) {
			this.queueFinish()
			return
		}
		let track = this.getTrack(request.slug)
		if (!track) {
			this.queueNext(0)
			return
		}

		// emit queue changes
		this.queueSubject.next({
			current: request,
			enqueued: this.queue,
		})

		if (BeatSaber.Settings.blockQueue) {
			await this.queueBlock()
		}

		// when the queue is cleared forcibly, cancel everything
		// including the request waiting to be unblocked
		if (this.queueCleared) {
			this.queueCleared = false
			this.queueNext(0)
			return
		}

		let delay = request.postRunDelay

		if (!request.requestShouldRun(track)) {
			this.log("[TrackQueue] Run: skipping", track.slug)
			delay = 0
		} else {
			this.log(
				"[TrackQueue] Run: executing",
				track.slug,
				"with current state",
				track.state
			)

			// prepare the request and emit if applicable
			if (request.requestWillRun(track)) {
				this.emit(track)
			}

			// execute the request and emit to subscribers
			try {
				track = await request.run(track)
			} catch (e) {
				console.error("Queue error", e)
				this.queueNext(0)
				return
			}
			track.calculateState(true)
			this.emit(track)

			// store the resolved track
			await BeatSaber.Storage.putTrack(track)
		}

		// delete the subject if no more requests is queued AND there is no observers
		if (
			!this.queue.some((request) => request.slug == track.slug) &&
			!this.observables.has(track.slug)
		) {
			this.subjects.delete(track.slug)
		}

		if (delay) {
			// emit no current queue item
			this.queueSubject.next({ current: null })
		}

		this.queueNext(delay)
	}

	private queueFinish() {
		this.log("[TrackQueue] Run: Queue finished")
		this.queueSubject.next({ current: null, enqueued: this.queue })
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

	observe(track: Track): Observable<Track> {
		if (this.observables.has(track.slug)) {
			return this.getObservable(track.slug)
		}

		const subject =
			this.getSubject(track.slug) || new BehaviorSubject(track)
		const observable = subject.pipe(
			finalize(() => {
				this.finalize(track.slug)
			}),
			shareReplay({ bufferSize: 1, refCount: true })
		)

		this.subjects.set(track.slug, subject)
		this.observables.set(track.slug, observable)

		return observable
	}

	private async requestOrResolveMaps(track: Track, userQuery?: string) {
		if (!userQuery) {
			const found = await BeatSaber.Storage.getTrack(track)
			if (found && found.maps != null) {
				this.emit(found)
				return
			}
		}

		const request = new MapsRequest({
			slug: track.slug,
			userQuery: userQuery,
		})
		this.enqueue(request, !!userQuery)
	}

	requestMaps(track: Track, userQuery?: string): Observable<Track> {
		this.log("[TrackQueue] Requesting maps for", track.slug)
		const observable = this.observe(track)
		this.requestOrResolveMaps(track, userQuery)
		return observable
	}

	requestDetails(track: Track): Observable<Track> {
		this.log("[TrackQueue] Requesting details for", track.slug)
		const observable = this.observe(track)
		const request = new DetailsRequest({ slug: track.slug })
		this.enqueue(request, true)
		return observable
	}

	requestArtistImage(track: Track): Observable<Track> {
		this.log("[TrackQueue] Requesting artist image for", track.slug)
		const observable = this.observe(track)
		const request = new ArtistImageRequest({ slug: track.slug })
		this.enqueue(request, true)
		return observable
	}

	async reviewTrack(
		track: Track,
		includeHashes: Set<string>,
		notInterestedHashes: Set<string>
	) {
		// get hashes NOT marked as not-interested
		const interestedHashes = track.hashes.minus(notInterestedHashes)
		// get maps marked as not-interested
		const notInterested = track.maps.filter((map) =>
			notInterestedHashes.has(map.versions[0].hash)
		)

		track.includeHashes = interestedHashes.intersect(includeHashes)
		track.excludeHashes = interestedHashes.minus(includeHashes)
		track.notInterestedHashes = track.hashes.intersect(notInterestedHashes)
		track.reviewed = true
		track.calculateMatches()

		for (const subject of this.subjects.values()) {
			const trk = subject.value
			let emit = false
			if (trk.hashes.hasAny(interestedHashes)) {
				trk.notInterestedHashes.deleteAll(interestedHashes)
				emit = true
			}
			if (trk.hashes.hasAny(notInterestedHashes)) {
				trk.includeHashes.deleteAll(notInterestedHashes)
				trk.excludeHashes.deleteAll(notInterestedHashes)
				trk.notInterestedHashes.addAll(notInterestedHashes)
				emit = true
			}
			if (emit) {
				trk.calculateMatches()
				this.emit(trk)
			}
		}

		await BeatSaber.Storage.removeHashes(
			HashType.NOT_INTERESTED,
			interestedHashes
		)
		await BeatSaber.Storage.putHashes(
			HashType.NOT_INTERESTED,
			notInterested
		)
		await BeatSaber.Storage.putTrack(track)

		this.emit(track)
	}

	finalize(slug: string) {
		this.log("[TrackQueue] Finalizing", slug)
		this.observables.delete(slug)
		// delete the subject if no more requests is queued (because there is no more observers)
		if (!this.queue.some((request) => request.slug == slug)) {
			this.subjects.delete(slug)
		}
	}

	cancelRequests(slug: string) {
		this.queue = this.queue.filter(
			(request) => request instanceof MapsRequest || request.slug != slug
		)
		// emit queue changes
		this.queueSubject.next({ enqueued: this.queue })
	}

	clear() {
		this.queue = []
		// emit queue changes
		this.queueSubject.next({ enqueued: this.queue })
		this.queueCleared = true
		this.queueUnblock()
	}
}
