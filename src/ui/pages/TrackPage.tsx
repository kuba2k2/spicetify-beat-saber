import { MapDetail } from "beatsaver-api/lib/models/MapDetail"
import { skip, Subscription } from "rxjs"
import { Track, TrackState } from "../../core/models/Track"
import { BuiltInLevelHeader } from "../components/BuiltInLevelHeader"
import { EmptyView } from "../components/EmptyView"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { MapListTable } from "../components/MapListTable"
import { MapListSets } from "../components/MapListTypes"
import { SearchField } from "../components/SearchField"
import { TrackHeader } from "../components/TrackHeader"

type TrackPageProps = {
	track: Track
}

type TrackPageState = {
	query: string
	bubbleVisible?: boolean
	bubbleType?: BubbleType
	bubbleText?: string
} & TrackPageProps &
	Required<MapListSets>

type BubbleType = "success" | "info" | "error"

export class TrackPage extends Spicetify.React.Component<
	TrackPageProps,
	TrackPageState
> {
	subscription: Subscription = null
	bubbleTimeout: NodeJS.Timeout
	scrollNodeRef: Spicetify.React.RefObject<HTMLDivElement>

	constructor(props: TrackPageProps) {
		super(props)
		this.handleSearchQuery = this.handleSearchQuery.bind(this)
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
		this.handleMatchClick = this.handleMatchClick.bind(this)
		this.handleDoesntMatchClick = this.handleDoesntMatchClick.bind(this)
		this.handleNotInterestedClick = this.handleNotInterestedClick.bind(this)
		this.handleBookmarkClick = this.handleBookmarkClick.bind(this)
		this.handleDownloadClick = this.handleDownloadClick.bind(this)

		this.scrollNodeRef = Spicetify.React.createRef()
		this.state = {
			track: props.track,
			query: props.track.getSearchQuery(),
			matchHashes: props.track.allMatchHashes,
			notInterestedHashes: props.track.notInterestedHashes,
			bookmarkedKeys: props.track.bookmarkedKeys,
			bookmarkingKeys: new Set(),
			downloadedHashes: props.track.downloadedHashes,
			downloadingHashes: new Set(),
		}
	}

	static showAsModal(track: Track) {
		Spicetify.showReactModal({
			title: "Beat Saber - Search results",
			children: <TrackPage track={track} />,
			okLabel: "OK",
			className: "bs-modal",
		})
	}

	private log(...data: unknown[]) {
		if (BeatSaber.Settings.logTrackPage) {
			console.log("[TrackPage]", ...data)
		}
	}

	componentDidMount() {
		this.subscription = BeatSaber.TrackQueue.observe(this.state.track)
			.pipe(skip(1))
			.subscribe((track) => {
				this.setState({
					track: track,
					matchHashes: this.state.matchHashes.concat(
						track.allMatchHashes
					),
					notInterestedHashes: this.state.notInterestedHashes.concat(
						track.notInterestedHashes
					),
					bookmarkedKeys: track.bookmarkedKeys,
					bookmarkingKeys: this.state.bookmarkingKeys.minus(
						track.bookmarkedKeys
					),
					downloadedHashes: track.downloadedHashes,
					downloadingHashes: this.state.downloadingHashes.minus(
						track.downloadedHashes
					),
				})
			})
		this.log("Subscribing", this.subscription)
	}

	componentWillUnmount() {
		this.log("Unsubscribing")
		this.subscription?.unsubscribe()
		BeatSaber.TrackQueue.cancelRequests(this.state.track.slug)
		if (this.state.track.maps != null) {
			BeatSaber.TrackQueue.reviewTrack(
				this.state.track,
				this.state.matchHashes,
				this.state.notInterestedHashes
			)
		}
	}

	handleSearchQuery(query: string) {
		this.setState({ query: query })
	}

	handleSearchSubmit() {
		const query =
			this.state.query || this.state.track.getDefaultSearchQuery()
		this.log("Submitting query", query)
		BeatSaber.TrackQueue.requestMaps(this.state.track, query)
	}

	handleMatchClick(map: MapDetail) {
		const hash = map.versions[0].hash
		// keep the map hash only in matchHashes array
		this.state.matchHashes.add(hash)
		this.state.notInterestedHashes.delete(hash)
		this.forceUpdate()
	}

	handleDoesntMatchClick(map: MapDetail) {
		const hash = map.versions[0].hash
		// remove the map hash from both arrays
		this.state.matchHashes.delete(hash)
		this.state.notInterestedHashes.delete(hash)
		this.forceUpdate()
	}

	handleNotInterestedClick(map: MapDetail) {
		const hash = map.versions[0].hash
		// keep the map hash only in notInterestedHashes array
		this.state.matchHashes.delete(hash)
		this.state.notInterestedHashes.add(hash)
		this.forceUpdate()
	}

	async handleBookmarkClick(map: MapDetail) {
		this.state.bookmarkingKeys.add(map.id)
		this.forceUpdate()
		try {
			if (this.state.bookmarkedKeys.has(map.id)) {
				await BeatSaber.MapQueue.bookmarkRemove(map)
				this.showBubble("info", "Removed bookmark for " + map.name)
			} else {
				await BeatSaber.MapQueue.bookmarkAdd(map)
				this.showBubble("success", "Bookmarked " + map.name)
			}
		} catch (e) {
			this.showBubble("error", e.toString())
		}
		this.state.bookmarkingKeys.delete(map.id)
		this.forceUpdate()
	}

	async handleDownloadClick(map: MapDetail) {
		const hash = map.versions[0].hash
		this.state.downloadingHashes.add(hash)
		this.forceUpdate()
		try {
			if (this.state.downloadedHashes.has(hash)) {
				await BeatSaber.MapQueue.downloadRemove(map)
				this.showBubble("info", "Deleted " + map.name)
			} else {
				await BeatSaber.MapQueue.downloadAdd(map)
				this.showBubble("success", "Downloaded " + map.name)
			}
		} catch (e) {
			this.showBubble("error", e.toString())
		}
		this.state.downloadingHashes.delete(hash)
		this.forceUpdate()
	}

	showBubble(type: BubbleType, text: string) {
		this.setState({
			bubbleVisible: true,
			bubbleType: type,
			bubbleText: text,
		})
		clearTimeout(this.bubbleTimeout)
		this.bubbleTimeout = setTimeout(() => {
			this.setState({ bubbleVisible: false })
		}, 5000)
	}

	render() {
		const track = this.state.track

		if (!BeatSaber.IsBrowser && !track.builtInLevel) {
			if (!track.imageUri) {
				BeatSaber.TrackQueue.requestDetails(track)
			} else if (!track.artistImage) {
				BeatSaber.TrackQueue.requestArtistImage(track)
			}
		}

		let header: Spicetify.React.ReactNode
		let page: Spicetify.React.ReactNode

		if (
			track.state === TrackState.ENQUEUED ||
			track.state === TrackState.SEARCHING
		) {
			// queued or searching, show progress bar
			page = <LoadingSpinner />
		} else if (track.maps?.length) {
			// maps == [...], show results table
			page = (
				<MapListTable
					maps={this.state.track.maps}
					// pass MapListSets
					{...this.state}
					onMatchClick={this.handleMatchClick}
					onDoesntMatchClick={this.handleDoesntMatchClick}
					onNotInterestedClick={this.handleNotInterestedClick}
					onBookmarkClick={this.handleBookmarkClick}
					onDownloadClick={this.handleDownloadClick}
				/>
			)
		} else if (!track.builtInLevel || track.userQuery) {
			// maps == [] + not a built-in level, show no results
			page = <EmptyView query={track.getSearchQuery()} hint="" />
		}

		if (track.builtInLevel) {
			header = <BuiltInLevelHeader level={track.builtInLevel} />
		} else {
			header = <TrackHeader track={track} />
		}

		return (
			<div
				className="bs-track-page"
				ref={this.scrollNodeRef}
				key={this.props.track.slug}
			>
				{header}

				<SearchField
					placeholder={this.state.track.getDefaultSearchQuery()}
					value={this.state.query}
					onSearch={this.handleSearchQuery}
					onSubmit={this.handleSearchSubmit}
				/>

				{page}

				<div className="notification-bubble-mount-node">
					<div
						className={`notification-bubble-container ${
							this.state.bubbleType
						} ${this.state.bubbleVisible ? "" : "is-hidden"}`}
					>
						<span>{this.state.bubbleText}</span>
					</div>
				</div>
			</div>
		)
	}
}
