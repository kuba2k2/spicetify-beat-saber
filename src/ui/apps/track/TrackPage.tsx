import React from "react"
import { MapDetail } from "beatsaver-api/lib/models/MapDetail"
import { skip, Subscription } from "rxjs"
import { Track, TrackState } from "../../../core/models/Track"
import { TrackHeaderOst } from "./TrackHeaderOst"
import { EmptyView } from "../../components/EmptyView"
import { LoadingSpinner } from "../../components/LoadingSpinner"
import { TrackMapTable } from "./TrackMapTable"
import { TrackMapSets } from "./TrackMapTypes"
import { TrackHeaderCustom } from "./TrackHeaderCustom"
import { TextField } from "../../controls/TextField"
import styled from "styled-components"

type TrackPageProps = {
	track: Track
}

type TrackPageState = {
	query: string
	bubbleVisible?: boolean
	bubbleType?: BubbleType
	bubbleText?: string
} & TrackPageProps &
	Required<TrackMapSets>

type BubbleType = "success" | "info" | "error"

const Page = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: scroll;
	height: 100%;

	--gradient-bg: ${() =>
		BeatSaber.IsZlink ? "var(--spice-main)" : "var(--spice-card)"};
`

const SearchField = styled(TextField)`
	margin: 8px;
`

export class TrackPage extends React.Component<TrackPageProps, TrackPageState> {
	subscription: Subscription = null
	bubbleTimeout: NodeJS.Timeout
	scrollNodeRef: React.RefObject<HTMLDivElement>

	constructor(props: TrackPageProps) {
		super(props)
		// search
		this.handleSearchQuery = this.handleSearchQuery.bind(this)
		this.handleSearchClear = this.handleSearchClear.bind(this)
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
		// matching
		this.handleMatchClick = this.handleMatchClick.bind(this)
		this.handleDoesntMatchClick = this.handleDoesntMatchClick.bind(this)
		this.handleNotInterestedClick = this.handleNotInterestedClick.bind(this)
		// actions
		this.handlePlayClick = this.handlePlayClick.bind(this)
		this.handleBookmarkClick = this.handleBookmarkClick.bind(this)
		this.handleDownloadClick = this.handleDownloadClick.bind(this)

		this.scrollNodeRef = React.createRef()
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
		BeatSaber.Core.renderModal(
			{
				title: "Beat Saber - Search results",
				className: "bs-modal",
			},
			<TrackPage track={track} />
		)
	}

	private log(...data: unknown[]) {
		if (BeatSaber.Core.Settings.logTrackPage) {
			console.log("[TrackPage]", ...data)
		}
	}

	componentDidMount() {
		this.subscription = BeatSaber.Core.TrackQueue.observe(this.state.track)
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
		BeatSaber.Core.TrackQueue.cancelRequests(this.state.track.slug)
		if (this.state.track.maps != null) {
			BeatSaber.Core.TrackQueue.reviewTrack(
				this.state.track,
				this.state.matchHashes,
				this.state.notInterestedHashes
			)
		}
		BeatSaber.Core.pauseAudio()
	}

	handleSearchQuery(query: string) {
		this.setState({ query: query })
	}

	handleSearchClear() {
		this.setState({ query: "" })
	}

	handleSearchSubmit() {
		const query =
			this.state.query || this.state.track.getDefaultSearchQuery()
		this.log("Submitting query", query)
		BeatSaber.Core.TrackQueue.requestMaps(this.state.track, query)
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

	handlePlayClick(map: MapDetail) {
		BeatSaber.Core.playAudio(map.versions[0].previewURL)
	}

	async handleBookmarkClick(map: MapDetail) {
		this.state.bookmarkingKeys.add(map.id)
		this.forceUpdate()
		try {
			if (this.state.bookmarkedKeys.has(map.id)) {
				await BeatSaber.Core.MapQueue.bookmarkRemove(map)
				this.showBubble("info", "Removed bookmark for " + map.name)
			} else {
				await BeatSaber.Core.MapQueue.bookmarkAdd(map)
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
				await BeatSaber.Core.MapQueue.downloadRemove(map)
				this.showBubble("info", "Deleted " + map.name)
			} else {
				await BeatSaber.Core.MapQueue.downloadAdd(map)
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

		if (!BeatSaber.Core.IsBrowser && !track.builtInLevel) {
			if (!track.imageUri) {
				BeatSaber.Core.TrackQueue.requestDetails(track)
			} else if (!track.artistImage) {
				BeatSaber.Core.TrackQueue.requestArtistImage(track)
			}
		}

		let header: React.ReactNode
		let page: React.ReactNode

		if (
			track.state === TrackState.ENQUEUED ||
			track.state === TrackState.SEARCHING
		) {
			// queued or searching, show progress bar
			page = <LoadingSpinner />
		} else if (track.maps?.length) {
			// maps == [...], show results table
			page = (
				<TrackMapTable
					maps={this.state.track.maps}
					// pass MapListSets
					{...this.state}
					onMatchClick={this.handleMatchClick}
					onDoesntMatchClick={this.handleDoesntMatchClick}
					onNotInterestedClick={this.handleNotInterestedClick}
					onPlayClick={this.handlePlayClick}
					onBookmarkClick={this.handleBookmarkClick}
					onDownloadClick={this.handleDownloadClick}
				/>
			)
		} else if (!track.builtInLevel || track.userQuery) {
			// maps == [] + not a built-in level, show no results
			page = <EmptyView query={track.getSearchQuery()} hint="" />
		}

		if (track.builtInLevel) {
			header = <TrackHeaderOst level={track.builtInLevel} />
		} else {
			header = <TrackHeaderCustom track={track} />
		}

		return (
			<Page key={this.props.track.slug}>
				{header}

				<SearchField
					key="search"
					placeholder={this.state.track.getDefaultSearchQuery()}
					value={this.state.query}
					iconStart="search"
					iconEnd="x"
					onChange={this.handleSearchQuery}
					onSubmit={this.handleSearchSubmit}
					onIconEndClick={this.handleSearchClear}
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
			</Page>
		)
	}
}
