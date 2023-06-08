import React from "react"
import { TrackBase } from "../../core/models/TrackBase"
import { TrackApp } from "./TrackApp"

type NowPlayingAppState = {
	data?: {
		track: {
			uri: string
			metadata: {
				title: string
				artist_name: string
			}
		}
	}
}

export class NowPlayingApp extends React.Component<
	unknown,
	NowPlayingAppState
> {
	timeoutId: NodeJS.Timeout

	constructor() {
		super({})
		this.state = {
			data: Spicetify.Player.data,
		}
	}

	componentDidMount() {
		Spicetify.Player.addEventListener("songchange", () => {
			clearTimeout(this.timeoutId)
			// because react does not understand that a component
			// with changed props should be re-constructed
			// (or I'm stupid)
			this.setState({ data: null })
			this.timeoutId = setTimeout(() => {
				this.setState({ data: Spicetify.Player.data })
			}, 300)
		})
	}

	render() {
		const data = this.state.data
		if (!data) return null
		const track: TrackBase = {
			uri: Spicetify.URI.fromString(data.track.uri),
			title: data.track.metadata.title,
			artists: [data.track.metadata.artist_name],
		}
		return <TrackApp trackBase={track} />
	}
}
