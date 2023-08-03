import React from "react"
import styled from "styled-components"
import { TrackQueueRequest } from "../../../core/queue/base/TrackQueueRequest"
import { QueueState } from "../../../core/queue/TrackQueue"
import { PlaybarPopup, PlaybarPopupItem } from "../../components/PlaybarPopup"
import { SectionDivider } from "../../components/SectionDivider"
import { Button } from "../../controls/Button"
import { Icon } from "../../controls/Icon"
import { TextField } from "../../controls/TextField"
import { Toggle } from "../../controls/Toggle"
import { TrackPage } from "../track/TrackPage"
import { DirectoryPage } from "./DirectoryPage"

type SettingsPopupProps = {
	isOpen: boolean
} & QueueState

type SettingsPopupState = {
	backendCheck: boolean
	backendWait: boolean
	backendError: boolean
	backendVersion: string | null
	backendBsDir: string | null
	backendBsVer: string | null
}

const SettingsLabel = styled.span`
	margin-left: 10px;
	vertical-align: super;
`

const SettingsList = styled.ul`
	margin: 0 -20px;
`

const SettingsInfo = styled.div`
	text-align: center;
	padding: 0 16px 8px;
	color: var(--spice-subtext);

	& p {
		margin: 0;
	}
`

const SettingsField = styled(TextField)`
	margin-bottom: 15px;
`

const BackendIcon = styled(Icon)`
	margin-top: 2px;
`

export class SettingsPopup extends React.Component<
	SettingsPopupProps,
	SettingsPopupState
> {
	constructor(props: SettingsPopupProps) {
		super(props)
		this.handleBlockClick = this.handleBlockClick.bind(this)
		this.handleClearClick = this.handleClearClick.bind(this)
		this.state = {
			backendCheck: false,
			backendWait: false,
			backendError: false,
			backendVersion: null,
			backendBsDir: null,
			backendBsVer: null,
		}
	}

	handleBlockClick() {
		if (this.props.blocked) {
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

	handleInputChange(key: string, value: string): boolean {
		BeatSaber.Core.Settings[key] = value
		BeatSaber.Core.saveSettings()
		if (key.startsWith("backend")) {
			this.setState({ backendCheck: true })
		} else {
			this.forceUpdate()
		}
		return true
	}

	handleItemClick(request: TrackQueueRequest) {
		const track = BeatSaber.Core.TrackQueue.getTrack(request.slug)
		if (!track) return
		TrackPage.showAsModal(track)
	}

	handleBackendCheck() {
		this.updateBackend()
	}

	handleBsDirBrowse() {
		DirectoryPage.showAsModal(
			this.state.backendBsDir,
			this.handleBsDirChange.bind(this)
		)
	}

	async handleBsDirChange(path: string) {
		try {
			await BeatSaber.Core.Api.setBsDir(path)
			await this.updateBackend()
		} catch (e) {
			BeatSaber.Core.error(e)
		}
	}

	async componentDidUpdate(prevProps: SettingsPopupProps) {
		if (!this.props.isOpen || prevProps.isOpen === this.props.isOpen) return
		this.updateBackend()
	}

	async updateBackend() {
		this.setState({ backendCheck: false, backendWait: true })
		try {
			const version = await BeatSaber.Core.Api.checkBackend()
			let bsDir: string = null
			let bsVer: string = null
			try {
				const data = await BeatSaber.Core.Api.getBsDir()
				bsDir = data.path
				bsVer = data.version
			} catch {
				//
			}
			this.setState({
				backendWait: false,
				backendError: false,
				backendVersion: version,
				backendBsDir: bsDir,
				backendBsVer: bsVer,
			})
		} catch (e) {
			BeatSaber.Core.error(e)
			this.setState({ backendWait: false, backendError: true })
		}
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

		const inputsBsaber: { [key: string]: [string, IconType] } = {
			bsaberUsername: [
				"Username (profile name)",
				// @ts-ignore
				BeatSaber.IsZlink ? "user" : "artist",
			],
			bsaberLogin: ["Login (e-mail or login username)", "edit"],
			bsaberPassword: ["Password", "locked"],
		}

		let requests = this.props.enqueued
		if (this.props.current) {
			requests = [this.props.current].concat(this.props.enqueued)
		}

		return (
			<PlaybarPopup
				isOpen={this.props.isOpen}
				title={`Beat Saber v${BeatSaber.Manifest.BundleVersion}`}
				titleIcon={this.props.blocked ? "block" : undefined}
				onTitleIconClick={this.handleBlockClick}
			>
				<SectionDivider
					title="Settings"
					description="BeastSaber login"
				/>

				{Object.entries(inputsBsaber).map(([key, [value, icon]]) => (
					<SettingsField
						key={key}
						type={
							key.toLowerCase().includes("password")
								? "password"
								: "text"
						}
						label={value}
						placeholder={value}
						value={BeatSaber.Core.Settings[key]}
						iconStart={icon}
						onChange={this.handleInputChange.bind(this, key)}
					/>
				))}

				<SectionDivider description="Backend config" />

				<SettingsField
					key="backendHostname"
					label="Hostname"
					placeholder="Hostname (domain:port)"
					value={BeatSaber.Core.Settings.backendHostname}
					iconStart={
						(BeatSaber.IsZlink
							? "device-computer"
							: "computer") as IconType
					}
					onChange={this.handleInputChange.bind(
						this,
						"backendHostname"
					)}
				/>

				<SettingsInfo style={{ marginTop: "-10px" }}>
					{this.state.backendCheck ? (
						<p>
							<BackendIcon icon={BeatSaber.Icons["question"]} />
							<a
								href="#"
								onClick={this.handleBackendCheck.bind(this)}
							>
								Click to check connection
							</a>
						</p>
					) : this.state.backendWait ? (
						<p>
							<BackendIcon icon={BeatSaber.Icons["search"]} />
							Checking connection...
						</p>
					) : this.state.backendError ? (
						<p>
							<BackendIcon icon={BeatSaber.Icons["x"]} />
							Couldn't connect to backend
						</p>
					) : this.state.backendVersion ? (
						<p>
							<BackendIcon icon={BeatSaber.Icons["check"]} />
							Connected: v{this.state.backendVersion}
						</p>
					) : (
						<div />
					)}
				</SettingsInfo>

				{/* <SettingsField
					key="backendAuth"
					label="Authentication"
					placeholder="Authentication"
					value={BeatSaber.Core.Settings.backendAuth}
					iconStart="locked"
					onChange={this.handleInputChange.bind(this, "backendAuth")}
				/> */}

				<SettingsField
					key="backendBsDir"
					label="Beat Saber directory"
					placeholder="C:\..."
					value={
						this.state.backendVersion
							? this.state.backendBsDir ?? ""
							: ""
					}
					iconStart="playlist-folder"
					iconEnd={BeatSaber.Icons["queue"]}
					onIconEndClick={this.handleBsDirBrowse.bind(this)}
				/>

				<SettingsInfo style={{ marginTop: "-10px" }}>
					{this.state.backendBsDir ? (
						<p>
							<BackendIcon icon={BeatSaber.Icons["check"]} />
							Beat Saber {this.state.backendBsVer}
						</p>
					) : (
						<p>
							<BackendIcon icon={BeatSaber.Icons["x"]} />
							Not a valid path
						</p>
					)}
				</SettingsInfo>

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
						<Button
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
								isActive={this.props.current && !index}
								onClick={this.handleItemClick.bind(
									this,
									request
								)}
							/>
						)
					})}
				</SettingsList>
			</PlaybarPopup>
		)
	}
}
