import BeatSaverAPI from "beatsaver-api"
import { Storage } from "./storage/Storage"
import { Track } from "./models/Track"
import { TrackQueue } from "./queue/TrackQueue"
import { BridgeUtils } from "./BridgeUtils"
import { DemoPage } from "../ui/pages/DemoPage"
import { AppWatcher } from "../ui/watchers/AppWatcher"
import { PopupPage } from "../ui/pages/PopupPage"
import { NowPlayingPage } from "../ui/pages/NowPlayingPage"
import BeastSaber from "beastsaber-api"
import { MapQueue } from "./queue/MapQueue"

declare global {
	interface Window {
		track: Track
	}
}

export class BeatSaberCore {
	Api = new BeatSaverAPI({
		AppName: "spicetify-beat-saber",
		Version: BeatSaberManifest.BundleVersion,
	})
	Bsaber = new BeastSaber()

	BaseUrl = "https://beatsaber.app.spotify.com"
	AssetsUrl = "https://beatsaber-assets.app.spotify.com"

	MainCSSFile = `/css/beatsaber.css`
	AdditionalCSSFiles = [this.MainCSSFile, "/css/zlink-button.css"]

	IsBrowser: boolean
	Storage: Storage
	TrackQueue: TrackQueue
	MapQueue: MapQueue
	Bridge: BridgeUtils
	Settings = {
		blockQueue: true,
		logQueue: false,
		logMapQueue: false,
		logStateButton: false,
		logTrackPage: false,
		logWatchers: false,
	}

	private redirector: HTMLAnchorElement = null

	public async initialize(isBrowser: boolean) {
		this.IsBrowser = isBrowser
		this.Storage = new Storage()
		this.TrackQueue = new TrackQueue()
		this.MapQueue = new MapQueue()
		this.Bridge = new BridgeUtils()
		await this.Storage.initialize()

		const settings = Spicetify.LocalStorage.get("beatsaber:settings")
		if (settings) {
			this.Settings = JSON.parse(settings)
		}

		new AppWatcher(document.body as HTMLBodyElement).connect()

		const playerControls = document.querySelector(
			".extra-controls-container"
		)
		playerControls.prepend(PopupPage.getWrapped())

		const nowPlayingButton = document.querySelector(
			".nowplaying-add-button"
		)
		nowPlayingButton.after(NowPlayingPage.getWrapped())

		if (isBrowser) {
			Spicetify.ReactDOM.render(
				Spicetify.React.createElement(DemoPage),
				document.getElementById("root")
			)
		}
	}

	public initializeSubApp(window: Window) {
		Spicetify.ReactDOM.render(
			Spicetify.React.createElement(DemoPage),
			window.document.getElementById("root")
		)
	}

	public saveSettings() {
		Spicetify.LocalStorage.set(
			"beatsaber:settings",
			JSON.stringify(this.Settings)
		)
	}

	public openApp(uri: Spicetify.URI) {
		if (this.redirector == null) {
			this.redirector = document.createElement("a")
			this.redirector.style.display = "none"
			window.top.document.body.appendChild(this.redirector)
		}
		this.redirector.href = uri.toString()
		this.redirector.click()
	}
}
