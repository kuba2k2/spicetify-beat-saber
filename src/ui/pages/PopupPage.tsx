import React from "react"
import ReactDOM from "react-dom"
import { ChangeEvent } from "react"
import { Subscription } from "rxjs"
import { TrackQueueRequest } from "../../core/queue/base/TrackQueueRequest"
import { QueueState } from "../../core/queue/TrackQueue"
import { Toggle } from "../components/Toggle"
import { PlaybarPopup, PlaybarPopupItem } from "../components/PlaybarPopup"
import { TrackPage } from "./TrackPage"
import { SectionDivider } from "../components/SectionDivider"
import styled from "styled-components"

type QueueButtonState = {
	popupVisible: boolean
} & QueueState

const SettingsLabel = styled.span`
	margin-left: 10px;
	vertical-align: super;
`

const SettingsList = styled.ul`
	margin: 0 -20px;
`

const SettingsInfo = styled.div`
	text-align: center;
	padding: 0 16px;
	color: var(--spice-subtext);

	& p {
		margin: 0;
	}
`

export class PopupPage extends React.Component<unknown, QueueButtonState> {
	subscription: Subscription

	constructor() {
		super({})
		this.handleIconClick = this.handleIconClick.bind(this)
		this.handleBlockClick = this.handleBlockClick.bind(this)
		this.handleClearClick = this.handleClearClick.bind(this)
		this.state = {
			enqueued: [],
			blocked: false,
			popupVisible: false,
		}
	}

	static getWrapped(): HTMLDivElement {
		const parent = document.createElement("div")
		ReactDOM.render(<PopupPage />, parent)
		return parent
	}

	componentDidMount() {
		this.subscription = BeatSaber.Core.TrackQueue.queueSubject.subscribe(
			(state) => {
				this.setState(state)
			}
		)
	}

	componentWillUnmount() {
		this.subscription.unsubscribe()
	}

	handleIconClick() {
		this.setState({
			popupVisible: !this.state.popupVisible,
		})
	}

	handleBlockClick() {
		if (this.state.blocked) {
			BeatSaber.Core.TrackQueue.queueUnblock()
			return
		}
	}

	handleClearClick() {
		BeatSaber.Core.TrackQueue.clear()
	}

	handleSettingChange(key: string, isEnabled: boolean): boolean {
		BeatSaber.Core.Settings[key] = isEnabled
		BeatSaber.Core.saveSettings()
		this.forceUpdate()
		return true
	}

	handleInputChange(
		key: string,
		event: ChangeEvent<HTMLInputElement>
	): boolean {
		BeatSaber.Core.Settings[key] = event.target.value
		BeatSaber.Core.saveSettings()
		this.forceUpdate()
		return true
	}

	handleItemClick(request: TrackQueueRequest) {
		const track = BeatSaber.Core.TrackQueue.getTrack(request.slug)
		if (!track) return
		TrackPage.showAsModal(track)
	}

	render() {
		const toggles = {
			blockQueue: "Block queue",
			logQueue: "Debug TrackQueue",
			logMapQueue: "Debug MapQueue",
			logStateButton: "Debug StateButton",
			logTrackPage: "Debug TrackPage",
			logWatchers: "Debug UI watchers",
		}

		const inputsBsaber = {
			bsaberUsername: "Username (profile name)",
			bsaberLogin: "Login (e-mail or login username)",
			bsaberPassword: "Password",
		}

		const inputsBackend = {
			backendHostname: "Hostname (domain:port)",
			backendAuth: "Authentication",
		}

		let requests = this.state.enqueued
		if (this.state.current) {
			requests = [this.state.current].concat(this.state.enqueued)
		}

		return (
			<div className="bs-queue-button">
				<button
					type="button"
					className={`CanonicalButton Button Button--style-icon Button--size-32 bs-icon-note ${
						this.state.blocked ? "bs-red" : ""
					}`}
					data-tooltip="Beat Saber"
					onClick={this.handleIconClick}
				>
					<small>{requests.length}</small>
				</button>

				<PlaybarPopup
					isOpen={this.state.popupVisible}
					title={`Beat Saber v${BeatSaber.Manifest.BundleVersion}`}
					titleIcon={this.state.blocked ? "block" : undefined}
					onTitleIconClick={this.handleBlockClick}
				>
					<SectionDivider
						title="Settings"
						description="BeastSaber login"
					/>

					{Object.entries(inputsBsaber).map(([key, value]) => (
						<div className="form-group">
							<label htmlFor={key}>{value}</label>
							<br />
							<input
								placeholder={value}
								className="form-control"
								type={
									key.toLowerCase().includes("password")
										? "password"
										: "text"
								}
								name={key}
								value={BeatSaber.Core.Settings[key]}
								onChange={this.handleInputChange.bind(
									this,
									key
								)}
							/>
						</div>
					))}

					<SectionDivider description="Backend config" />

					{Object.entries(inputsBackend).map(([key, value]) => (
						<div className="form-group">
							<label htmlFor={key}>{value}</label>
							<br />
							<input
								placeholder={value}
								className="form-control"
								type="text"
								name={key}
								value={BeatSaber.Core.Settings[key]}
								onChange={this.handleInputChange.bind(
									this,
									key
								)}
							/>
						</div>
					))}

					<SectionDivider description="Debugging" />

					{Object.entries(toggles).flatMap(([key, value]) => [
						<Toggle
							onChange={this.handleSettingChange.bind(this, key)}
							isActive={BeatSaber.Core.Settings[key]}
						/>,
						<SettingsLabel>{value}</SettingsLabel>,
						<br />,
					])}

					<SectionDivider title="Queue" />

					{requests.length == 0 && (
						<SettingsInfo>
							<p>The queue is currenty empty.</p>
						</SettingsInfo>
					)}

					{requests.length != 0 && (
						<SettingsInfo>
							<BeatSaber.React.Button
								type="blue"
								text="Clear queue"
								onClick={this.handleClearClick}
							/>
						</SettingsInfo>
					)}

					<SettingsList>
						{requests.map((request, index) => {
							let icon: Spicetify.Model.Icon = "airplay"
							switch (request.type) {
								case "MapsRequest":
									icon = "search"
									break
								case "DetailsRequest":
									icon = "album"
									break
								case "ArtistImageRequest":
									icon = "artist"
									break
							}
							return (
								<PlaybarPopupItem
									icon={icon}
									title={request.type}
									info={<code>{request.slug}</code>}
									isActive={this.state.current && !index}
									onClick={this.handleItemClick.bind(
										this,
										request
									)}
								/>
							)
						})}
					</SettingsList>
				</PlaybarPopup>
			</div>
		)
	}
}
