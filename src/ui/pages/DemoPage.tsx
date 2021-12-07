import { Track } from "../../core/models/Track";
import { TrackBase } from "../../core/models/TrackBase";
import { QueueState } from "../components/QueueState";
import { StateButton } from "../components/StateButton";
import { TrackPage } from "./TrackPage";

export class DemoPage extends Spicetify.React.Component {

	tracks: TrackBase[] = [
		{
			uri: Spicetify.URI.fromString(
				"spotify:track:5lqGAnVqlk8lJ5K3jCLpUX"
			),
			title: "Ether",
			artists: ["Fox Stevenson"],
		},
		{
			uri: Spicetify.URI.fromString(
				"spotify:track:5lqGAnVqlk8lJ5K3jCLpUX"
			),
			title: "Ether",
			artists: ["Fox Stevenson"],
		},
		{
			uri: Spicetify.URI.fromString(
				"spotify:track:4k6OqgD1d2szll4nD2IJhG"
			),
			title: "Perfect Lie",
			artists: ["Fox Stevenson"],
		},
		{
			uri: Spicetify.URI.fromString(
				"spotify:track:1VDBIDi6IeysCELFjPq0jR"
			),
			title: "YES",
			artists: ["Koven"],
		},
		{
			uri: Spicetify.URI.fromString(
				"spotify:track:0zDAH9Vyi1JsJCTrzaIEnv"
			),
			title: "Be There For You",
			artists: ["Sedliv"],
		},
		{
			uri: Spicetify.URI.fromString(
				"spotify:track:3NLr3Lsc9DnhJd9ObpoY3x"
			),
			title: "Light Up",
			artists: ["Koven"],
		},
		{
			uri: Spicetify.URI.fromString(
				"spotify:track:5Gp2779W5p9qN3idmx0nLQ"
			),
			title: "Rattlesnake",
			artists: ["Rogue"],
		},
	]

	constructor() {
		super({})
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(track: Track) {
		Spicetify.showReactModal({
			title: track.slug,
			children: <TrackPage track={track} />,
			okLabel: "OK",
			className: "bs-modal",
		})
	}

	render() {
		return (
			<div style={{ marginTop: 100 }}>
				{this.tracks.map(track => (
					<div className="bs-hover-parent">
						<StateButton
							onClick={this.handleClick}
							trackBase={track} />
						<span>{track.artists[0]} - {track.title}</span>
					</div>
				))}
				<hr />
				<QueueState />
			</div>
		)
	}
}
