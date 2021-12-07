import { Subscription } from "rxjs";
import { Track, TrackState } from "../../core/models/Track";
import { TrackBase } from "../../core/models/TrackBase";
import { TrackPage } from "../pages/TrackPage";

type StateButtonProps = {
	trackBase: TrackBase,
	onClick?: (track: Track) => void,
}

type StateButtonState = {
	track: Track
} & StateButtonProps

const stateClassMap = new Map([
	[TrackState.DEFAULT, [null, null]],
	[TrackState.ENQUEUED, ["more", null]],
	[TrackState.SEARCHING, ["search", null]],
	[TrackState.BUILT_IN, ["offline", null]],
	[TrackState.NOT_INTERESTED, ["block", "bs-hover"]],
	[TrackState.MAPS_NO_RESULTS, ["x", "bs-hover"]],
	[TrackState.MAPS_NO_RESULTS_NEW, ["x", null]],
	[TrackState.MAPS_EXCLUDED, ["x", "bs-hover"]],
	[TrackState.MAPS_NOT_INTERESTED, ["block", null]],
	[TrackState.MAPS_POSSIBLE, ["info", "bs-yellow"]],
	[TrackState.MAPS_MATCHED, ["check-alt", null]],
	[TrackState.MAPS_MATCHED_NEW, ["check-alt", "bs-green"]],
	[TrackState.BOOKMARKED, ["tag", null]],
	[TrackState.DOWNLOADING, ["download", null]],
	[TrackState.DOWNLOADED, ["downloaded", null]],
]) as Map<TrackState, [Spicetify.Model.Icon | null, string | null]>

export class StateButton extends Spicetify.React.Component<StateButtonProps, StateButtonState> {
	subscription: Subscription = null

	constructor(props: StateButtonProps) {
		super(props)
		this.handleClick = this.handleClick.bind(this)

		this.state = {
			trackBase: props.trackBase,
			track: new Track(props.trackBase),
		}
	}

	private log(...data: unknown[]) {
		if (BeatSaber.Settings.logStateButton) {
			console.log(...data)
		}
	}

	componentDidMount() {
		this.subscription = BeatSaber.TrackQueue
			.requestMaps(this.state.track)
			.subscribe(track => {
				this.setState({ track: track })
			})
		this.log("[StateButton] Subscribing", this.subscription)
	}

	componentWillUnmount() {
		this.log("[StateButton] Unsubscribing")
		this.subscription?.unsubscribe()
	}

	handleClick() {
		if (this.props.onClick) {
			this.props.onClick(this.state.track)
		} else {
			TrackPage.showAsModal(this.state.track)
		}
	}

	private getTooltip(): string {
		const track = this.state.track
		const level = track.builtInLevel
		let tooltip = "Beat Saber"
		switch (track.state) {
			case TrackState.ENQUEUED:
				tooltip = "Queued"
				break

			case TrackState.SEARCHING:
				tooltip = "Searching..."
				break

			case TrackState.BUILT_IN:
				if (level.pack.isDLC) {
					tooltip = `DLC level (${level.pack.name})`
				} else if (level.pack.isOST) {
					tooltip = level.pack.name
				} else {
					tooltip = `Built-in level (${level.pack.name})`
				}
				break

			case TrackState.NOT_INTERESTED:
				tooltip = `Not interested (${track.maps.length} matches)`
				break

			case TrackState.MAPS_NO_RESULTS:
			case TrackState.MAPS_NO_RESULTS_NEW:
				tooltip = "Not found"
				break

			case TrackState.MAPS_EXCLUDED:
				tooltip = `No matches (${track.excludeHashes.size} excluded)`
				break

			case TrackState.MAPS_NOT_INTERESTED:
				tooltip = `No interesting matches (${track.maps.length} total)`
				break

			case TrackState.MAPS_POSSIBLE:
				tooltip = `Possible matches: ${track.possibleMatchHashes.size}`
				break

			case TrackState.MAPS_MATCHED:
				tooltip = `Matches: ${track.includeHashes.size}`
				break

			case TrackState.MAPS_MATCHED_NEW:
				if (track.includeHashes.size) {
					tooltip = `New matches: ${track.matchHashes.size} (${track.allMatchCount} total)`
				} else {
					tooltip = `New matches: ${track.matchHashes.size}`
				}
				break

			case TrackState.BOOKMARKED:
				tooltip = "Bookmarked"
				break

			case TrackState.DOWNLOADING:
				tooltip = "Downloading..."
				break

			case TrackState.DOWNLOADED:
				tooltip = "Downloaded"
				break
		}
		return tooltip
	}

	render() {
		const [icon, taId] = stateClassMap.get(this.state.track.state)
		return (
			<Button
				type="icon"
				icon={icon}
				size={32}
				taId={taId}
				tooltip={this.getTooltip()}
				onClick={this.handleClick} />
		)
	}
}
