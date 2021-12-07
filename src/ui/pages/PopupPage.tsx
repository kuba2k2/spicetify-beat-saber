import { Subscription } from "rxjs"
import { QueueRequest } from "../../core/queue/requests/QueueRequest"

type QueueButtonState = {
	items: QueueRequest[]
	blocked: boolean
	popupVisible: boolean
}

export class PopupPage extends Spicetify.React.Component<unknown, QueueButtonState> {
	subscription: Subscription

	constructor() {
		super({})
		this.handleIconClick = this.handleIconClick.bind(this)
		this.handleBlockClick = this.handleBlockClick.bind(this)
		this.handleClearClick = this.handleClearClick.bind(this)
		this.state = {
			items: [],
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
		this.subscription = BeatSaber.TrackQueue.queueSubject.subscribe(state => {
			if (state === true || state === false) {
				this.setState({ blocked: state })
			} else {
				this.setState({ items: state })
			}
		})
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

	render() {
		const settings = {
			"blockQueue": "Block queue",
			"logQueue": "Enable TrackQueue logging",
			"logStateButton": "Enable StateButton logging",
			"logTrackPage": "Enable TrackPage logging",
			"logWatchers": "Enable UI watchers logging",
		}
		return (
			<div className="bs-queue-button">
				<button
					type="button"
					className={`CanonicalButton Button Button--style-icon Button--size-32 bs-icon-note ${this.state.blocked ? "bs-red" : ""}`}
					data-tooltip="Beat Saber"
					onClick={this.handleIconClick}
				>
					<small>{this.state.items.length}</small>
				</button>
				<div className={`bs-queue-popup ConnectPopup ${this.state.popupVisible ? "visible" : ""}`}>

					<div className="ConnectPopup__header">
						<h3 className="ConnectPopup__header-title">
							Beat Saber v{BeatSaberManifest.BundleVersion}
						</h3>
						{this.state.blocked && (
							<a href="#"
								className="ConnectPopup__header-help spoticon-block-16"
								onClick={this.handleBlockClick}></a>
						)}
					</div>

					<div className="ConnectPopup__content">

						{Object.entries(settings).flatMap(([key, value]) => [
							<GlueToggle
								onChange={this.handleSettingChange.bind(this, key)}
								isActive={BeatSaber.Settings[key]} />,
							<span className="bs-setting">{value}</span>,
							<br />,
						])}

						{this.state.items.length == 0 && (
							<div className="ConnectPopup__info">
								<p>The queue is currenty empty.</p>
							</div>
						)}

						{this.state.items.length != 0 && (
							<div className="ConnectPopup__button">
								<Button type="blue" text="Clear queue" onClick={this.handleClearClick} />
							</div>
						)}

						<ul>
							{this.state.items.map(request => (
								<li>
									<button className="ConnectPopup__device ConnectPopup__device--available ConnectPopup__device--active">
										<span className="ConnectPopup__device-image spoticon-device-computer-32"></span>
										<div className="ConnectPopup__device-body">
											<p className="ConnectPopup__device-title">{request.type}</p>
											<p className="ConnectPopup__device-info">
												<code>{request.slug}</code>
											</p>
										</div>
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}
