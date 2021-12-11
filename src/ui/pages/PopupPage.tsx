import { Subscription } from "rxjs"
import { QueueRequest } from "../../core/queue/requests/QueueRequest"
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
		this.subscription = BeatSaber.TrackQueue.queueSubject.subscribe(
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
			BeatSaber.TrackQueue.queueUnblock()
			return
		}
	}

	handleClearClick() {
		BeatSaber.TrackQueue.clear()
	}

	handleSettingChange(key: string, isEnabled: boolean): boolean {
		BeatSaber.Settings[key] = isEnabled
		BeatSaber.saveSettings()
		this.forceUpdate()
		return true
	}

	handleItemClick(request: QueueRequest) {
		const track = BeatSaber.TrackQueue.getTrack(request.slug)
		if (!track) return
		TrackPage.showAsModal(track)
	}

	render() {
		const settings = {
			blockQueue: "Block queue",
			logQueue: "Enable TrackQueue logging",
			logStateButton: "Enable StateButton logging",
			logTrackPage: "Enable TrackPage logging",
			logWatchers: "Enable UI watchers logging",
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
							Beat Saber v{BeatSaberManifest.BundleVersion}
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
						{Object.entries(settings).flatMap(([key, value]) => [
							<GlueToggle
								onChange={this.handleSettingChange.bind(
									this,
									key
								)}
								isActive={BeatSaber.Settings[key]}
							/>,
							<span className="bs-setting">{value}</span>,
							<br />,
						])}

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
