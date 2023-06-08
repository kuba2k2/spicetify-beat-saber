import React from "react"
import { Subscription } from "rxjs"
import { Track, TrackState } from "../../core/models/Track"
import { TrackBase } from "../../core/models/TrackBase"
import { Button, ButtonColor } from "../controls/Button"
import { TrackPage } from "./track/TrackPage"

type TrackAppProps = {
	trackBase: TrackBase
	className?: string
	onClick?: (track: Track) => void
}

type TrackAppState = {
	track: Track
} & TrackAppProps

const stateStyle: {
	[key in TrackState]: {
		icon: StateIconType | null
		hover?: boolean
		color?: ButtonColor
	}
} = {
	DEFAULT: { icon: null },
	ENQUEUED: { icon: "queue" },
	SEARCHING: { icon: "search" },
	BUILT_IN: { icon: "builtin" },
	NOT_INTERESTED: { icon: "block", hover: true },
	MAPS_NO_RESULTS: { icon: "x", hover: true },
	MAPS_NO_RESULTS_NEW: { icon: "x" },
	MAPS_EXCLUDED: { icon: "x", hover: true },
	MAPS_NOT_INTERESTED: { icon: "block" },
	MAPS_POSSIBLE: { icon: "question", color: "yellow" },
	MAPS_MATCHED: { icon: "check" },
	MAPS_MATCHED_NEW: { icon: "check", color: "green" },
	BOOKMARKED: { icon: "tag" },
	DOWNLOADING: { icon: "download" },
	DOWNLOADED: { icon: "downloaded" },
}

export class TrackApp extends React.Component<TrackAppProps, TrackAppState> {
	subscription: Subscription = null

	constructor(props: TrackAppProps) {
		super(props)
		this.handleClick = this.handleClick.bind(this)

		this.state = {
			trackBase: props.trackBase,
			track: new Track(props.trackBase),
		}
	}

	private log(...data: unknown[]) {
		if (BeatSaber.Core.Settings.logStateButton) {
			console.log("[StateButton]", ...data)
		}
	}

	componentDidMount() {
		this.subscription = BeatSaber.Core.TrackQueue.requestMaps(
			this.state.track
		).subscribe((track) => {
			this.setState({ track: track })
		})
		this.log("Subscribing", this.state.track.slug)
	}

	componentWillUnmount() {
		this.log("Unsubscribing")
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
		const style = stateStyle[this.state.track.state]
		return (
			<Button
				className={`${this.props.className} ${
					style.hover ? "bs-hover" : ""
				}`}
				type="icon"
				size={32}
				icon={BeatSaber.Icons[style.icon]}
				activeColor={style.color}
				isActive={!!style.color}
				tooltip={this.getTooltip()}
				onClick={this.handleClick}
			/>
		)
	}
}
