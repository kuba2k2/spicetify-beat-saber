import React from "react"
import styled from "styled-components"
import { Track } from "../../core/models/Track"
import { TrackBase } from "../../core/models/TrackBase"
import { Button } from "../controls/Button"
import { ButtonGroup } from "../controls/ButtonGroup"
import { DifficultyBadge } from "../components/DifficultyBadge"
import { Icon } from "../controls/Icon"
import { SearchField } from "../components/SearchField"
import { TextField } from "../controls/TextField"
import { Toggle } from "../controls/Toggle"
import { TrackPage } from "./track/TrackPage"

const PageWrapper = styled.div`
	margin-top: ${BeatSaber.IsZlink ? "100px" : "0"};
	padding: 0 ${BeatSaber.IsZlink ? "32px" : "var(--content-spacing)"};
`

const Title = styled.h1`
	color: var(--spice-text);
	font-size: 36px;
	font-weight: 900;
	line-height: 44px;
	letter-spacing: -0.005em;
`

const StyledTable = styled.table`
	border-collapse: collapse;

	td {
		padding: 5px;
		border: 1px solid grey;
	}
`

export class DemoPage extends React.Component {
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
		/* {this.tracks.map((track) => (
					<div className="bs-hover-parent">
						<StateButton
							onClick={this.handleClick}
							trackBase={track}
						/>
						<span>
							{track.artists[0]} - {track.title}
						</span>
					</div>
				))}
				<hr />
				<QueueStateDemo /> */

		const ZlinkButton = BeatSaber.IsXpui
			? (props) => <span></span>
			: (props) => <BeatSaber.React.Button {...props} />
		return (
			<PageWrapper>
				<Title>Demo Page</Title>
				<StyledTable>
					<tr>
						<th>Name</th>
						<th>Component</th>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<td>TextField</td>
						<td>
							<TextField
								iconEnd="x"
								onIconEndClick={alert}
								placeholder="Placeholder"
								value="Value"
								label="Text field label"
							/>
						</td>
					</tr>
					<tr>
						<td>Icon / Spoticon</td>
						<td>
							<Icon icon="block" />
						</td>
					</tr>
					<tr>
						<td>Icon / BeatSaber</td>
						<td>
							<Icon icon="bs-note" />
						</td>
					</tr>
					<tr>
						<td>SearchField</td>
						<td>
							<SearchField onSearch={console.log} />
						</td>
					</tr>
					<tr>
						<td>DifficultyBadge</td>
						<td>
							<DifficultyBadge
								characteristic="standard"
								difficulty="expertplus"
							/>
						</td>
					</tr>
					<tr>
						<td>Toggle</td>
						<td>
							<Toggle />
						</td>
					</tr>
					<tr>
						<td>Toggle / disabled</td>
						<td>
							<Toggle isDisabled={true} />
						</td>
					</tr>
					<tr>
						<td>LoadingSpinner</td>
						<td>{/* <LoadingSpinner /> */}</td>
					</tr>
					<tr>
						<td>ButtonGroup</td>
						<td>
							<ButtonGroup>
								{[
									["Check", "check"],
									["X", "x"],
									["Block", "block"],
								]}
							</ButtonGroup>
						</td>
					</tr>
					<tr>
						<td>Button / default</td>
						<td></td>
						<td>
							<Button text="Button" />
						</td>
						<td>
							<Button type="icon" icon="block" />
						</td>
					</tr>
					<tr>
						<td>Button / green</td>
						<td>
							<ZlinkButton type="green" text="Button" />
						</td>
						<td>
							<Button color="green" text="Button" />
						</td>
						<td>
							<Button color="green" type="icon" icon="block" />
						</td>
					</tr>
					<tr>
						<td>Button / green / disabled</td>
						<td>
							<ZlinkButton
								type="green"
								text="Button"
								isDisabled={true}
							/>
						</td>
						<td>
							<Button
								color="green"
								text="Button"
								isDisabled={true}
							/>
						</td>
						<td>
							<Button
								color="green"
								type="icon"
								icon="block"
								isDisabled={true}
							/>
						</td>
					</tr>
					<tr>
						<td>Button / gray</td>
						<td>
							<ZlinkButton type="gray" text="Button" />
						</td>
						<td>
							<Button color="gray" text="Button" />
						</td>
						<td>
							<Button color="gray" type="icon" icon="block" />
						</td>
					</tr>
					<tr>
						<td>Button / blue</td>
						<td>
							<ZlinkButton type="blue" text="Button" />
						</td>
						<td>
							<Button color="blue" text="Button" />
						</td>
						<td>
							<Button color="blue" type="icon" icon="block" />
						</td>
					</tr>
					<tr>
						<td>Button / red</td>
						<td>
							<ZlinkButton type="red" text="Button" />
						</td>
						<td>
							<Button color="red" text="Button" />
						</td>
						<td>
							<Button color="red" type="icon" icon="block" />
						</td>
					</tr>
					<tr>
						<td>Button / white</td>
						<td>
							<ZlinkButton type="white" text="Button" />
						</td>
						<td>
							<Button color="white" text="Button" />
						</td>
						<td>
							<Button color="white" type="icon" icon="block" />
						</td>
					</tr>
					<tr>
						<td>Button / transparent</td>
						<td></td>
						<td>
							<Button color="transparent" text="Button" />
						</td>
						<td>
							<Button
								color="transparent"
								type="icon"
								icon="block"
							/>
						</td>
					</tr>
					<tr>
						<td>Button / stroke</td>
						<td>
							<ZlinkButton type="stroke" text="Button" />
						</td>
						<td>
							<Button
								color="transparent"
								outline={true}
								text="Button"
							/>
						</td>
						<td>
							<Button
								color="transparent"
								outline={true}
								type="icon"
								icon="block"
							/>
						</td>
					</tr>
					<tr>
						<td>Button / text+icon</td>
						<td>
							<ZlinkButton
								type="green"
								text="Button"
								icon="block"
							/>
						</td>
						<td>
							<Button color="green" text="Button" icon="block" />
						</td>
					</tr>
					<tr>
						<td>Button / icon only</td>
						<td>
							<ZlinkButton type="green" icon="block" />
						</td>
						<td>
							<Button
								color="green"
								icon="block"
								onClick={console.log}
							/>
						</td>
					</tr>
					<tr>
						<td>Button / icon</td>
						<td>
							<ZlinkButton type="icon" icon="block" />
						</td>
						<td>
							<Button
								type="icon"
								icon="block"
								onClick={console.log}
							/>
						</td>
					</tr>
					<tr>
						<td>Button / icon + active</td>
						<td>
							<ZlinkButton
								type="icon"
								icon="block"
								isActive={true}
							/>
						</td>
						<td>
							<Button
								type="icon"
								icon="block"
								activeColor="green"
								isActive={true}
								onClick={console.log}
							/>
						</td>
					</tr>
					<tr>
						<td>Button / icon-background</td>
						<td>
							<ZlinkButton type="icon-background" icon="block" />
						</td>
						<td>
							<Button
								type="icon"
								icon="block"
								onClick={console.log}
							/>
						</td>
					</tr>
					<tr>
						<td>Button / icon-stroke</td>
						<td>
							<ZlinkButton type="icon-stroke" icon="block" />
						</td>
						<td>
							<Button
								type="icon"
								outline={true}
								icon="block"
								onClick={console.log}
							/>
						</td>
					</tr>
					<tr>
						<td>Button / icon-stroke + active</td>
						<td>
							<ZlinkButton
								type="icon-stroke"
								icon="block"
								isActive={true}
							/>
						</td>
						<td>
							<Button
								type="icon"
								outline={true}
								icon="block"
								isActive={true}
								onClick={console.log}
							/>
						</td>
					</tr>
					<tr>
						<td>Button / icon + text</td>
						<td></td>
						<td>
							<Button
								type="icon"
								icon="bs-note"
								text="2"
								onClick={console.log}
							/>
						</td>
					</tr>
				</StyledTable>
			</PageWrapper>
		)
	}
}
