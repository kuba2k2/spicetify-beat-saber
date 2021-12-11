import { MapDetail } from "beatsaver-api/lib/models/MapDetail"
import { skip, Subscription } from "rxjs"
import { Track, TrackState } from "../../core/models/Track"
import { BuiltInLevelHeader } from "../components/BuiltInLevelHeader"
import { EmptyView } from "../components/EmptyView"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { MapListTable } from "../components/MapListTable"
import { SearchField } from "../components/SearchField"
import { TrackHeader } from "../components/TrackHeader"

type TrackPageProps = {
	track: Track
}

type TrackPageState = {
	query: string
	matchHashes: Set<string>
	notInterestedHashes: Set<string>
} & TrackPageProps

export class TrackPage extends Spicetify.React.Component<
	TrackPageProps,
	TrackPageState
> {
	subscription: Subscription = null
	scrollNodeRef: Spicetify.React.RefObject<HTMLDivElement>

	constructor(props: TrackPageProps) {
		super(props)
		this.handleSearchQuery = this.handleSearchQuery.bind(this)
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
		this.handleMatchClick = this.handleMatchClick.bind(this)
		this.handleDoesntMatchClick = this.handleDoesntMatchClick.bind(this)
		this.handleNotInterestedClick = this.handleNotInterestedClick.bind(this)

		this.scrollNodeRef = Spicetify.React.createRef()
		this.state = {
			track: props.track,
			query: props.track.getSearchQuery(),
			matchHashes: props.track.allMatchHashes,
			notInterestedHashes: props.track.notInterestedHashes,
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
			console.log(...data)
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
				})
			})
		this.log("[TrackPage] Subscribing", this.subscription)
	}

	componentWillUnmount() {
		this.log("[TrackPage] Unsubscribing")
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
					matchHashes={this.state.matchHashes}
					notInterestedHashes={this.state.notInterestedHashes}
					onMatchClick={this.handleMatchClick}
					onDoesntMatchClick={this.handleDoesntMatchClick}
					onNotInterestedClick={this.handleNotInterestedClick}
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
			</div>
		)
	}
}
