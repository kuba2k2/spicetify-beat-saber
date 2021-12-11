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
import { BackendRequestHandler } from "./backend/BackendRequestHandler"
import { Subject } from "rxjs"
import { BackendUtils } from "./backend/BackendUtils"

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
	Storage = new Storage()
	TrackQueue = new TrackQueue()
	MapQueue = new MapQueue()
	Bridge = new BridgeUtils()
	ErrorSubject = new Subject<Error>()
	Settings = {
		blockQueue: true,
		logQueue: false,
		logMapQueue: false,
		logStateButton: false,
		logTrackPage: false,
		logWatchers: false,
		backendHostname: "localhost:23287",
		backendAuth: "YWRtaW46bmltZGE=",
		bsaberLogin: null,
		bsaberPassword: null,
	}

	private redirector: HTMLAnchorElement = null

	public async initialize(isBrowser: boolean) {
		const settings = Spicetify.LocalStorage.get("beatsaber:settings")
		if (settings) {
			Object.assign(this.Settings, JSON.parse(settings))
		}

		this.Bsaber.setRequestHandler(new BackendRequestHandler("bsaber.com"))
		await this.Storage.initialize()

		new AppWatcher(document.body as HTMLBodyElement).connect()

		this.ErrorSubject.subscribe((error) => {
			Spicetify.showNotification(error.toString())
		})

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
