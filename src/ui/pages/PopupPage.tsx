import { ChangeEvent } from "react"
import { Subscription } from "rxjs"
import { TrackQueueRequest } from "../../core/queue/base/TrackQueueRequest"
import { QueueState } from "../../core/queue/TrackQueue"
import { TrackPage } from "./TrackPage"

type QueueButtonState = {
	popupVisible: boolean
} & QueueState

export class PopupPage extends Spicetify.React.Component<
	unknown,
	QueueButtonState
> {
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
		Spicetify.ReactDOM.render(<PopupPage />, parent)
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

				<div
					className={`bs-queue-popup ConnectPopup ${
						this.state.popupVisible ? "visible" : ""
					}`}
				>
					<div className="ConnectPopup__header">
						<h3 className="ConnectPopup__header-title">
							Beat Saber v{BeatSaber.Manifest.BundleVersion}
						</h3>
						{this.state.blocked && (
							<a
								href="#"
								className="ConnectPopup__header-help spoticon-block-16"
								onClick={this.handleBlockClick}
							></a>
						)}
					</div>

					<div className="ConnectPopup__content">
						<GlueSectionDivider
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

						<GlueSectionDivider description="Backend config" />
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

						<GlueSectionDivider description="Debugging" />
						{Object.entries(toggles).flatMap(([key, value]) => [
							<GlueToggle
								onChange={this.handleSettingChange.bind(
									this,
									key
								)}
								isActive={BeatSaber.Core.Settings[key]}
							/>,
							<span className="bs-setting">{value}</span>,
							<br />,
						])}

						<GlueSectionDivider title="Queue" />

						{requests.length == 0 && (
							<div className="ConnectPopup__info">
								<p>The queue is currenty empty.</p>
							</div>
						)}

						{requests.length != 0 && (
							<div className="ConnectPopup__button">
								<Button
									type="blue"
									text="Clear queue"
									onClick={this.handleClearClick}
								/>
							</div>
						)}

						<ul>
							{requests.map((request, index) => {
								let icon = "airplay"
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
								const classNames = [
									"ConnectPopup__device",
									"ConnectPopup__device--available",
									this.state.current && !index
										? "ConnectPopup__device--active"
										: "",
								]
								return (
									<li
										onClick={this.handleItemClick.bind(
											this,
											request
										)}
									>
										<button
											className={classNames.join(" ")}
										>
											<span
												className={`ConnectPopup__device-image spoticon-${icon}-32`}
											></span>
											<div className="ConnectPopup__device-body">
												<p className="ConnectPopup__device-title">
													{request.type}
												</p>
												<p className="ConnectPopup__device-info">
													<code>{request.slug}</code>
												</p>
											</div>
										</button>
									</li>
								)
							})}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}
