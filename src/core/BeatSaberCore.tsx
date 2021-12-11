import { Storage } from "./storage/Storage"
import { Track } from "./models/Track"
import { TrackQueue } from "./queue/TrackQueue"
import { DemoPage } from "../ui/pages/DemoPage"
import { AppWatcher } from "../ui/watchers/AppWatcher"
import { PopupPage } from "../ui/pages/PopupPage"
import { NowPlayingPage } from "../ui/pages/NowPlayingPage"
import { MapQueue } from "./queue/MapQueue"
import { Subject } from "rxjs"
import { ApiUtils } from "./api/ApiUtils"
import { MapCategory } from "./storage/MapStorage"

declare global {
	interface Window {
		track: Track
	}
}

export class BeatSaberCore {
	BaseUrl = "https://beatsaber.app.spotify.com"
	AssetsUrl = "https://beatsaber-assets.app.spotify.com"

	MainCSSFile = `/css/beatsaber.css`
	AdditionalCSSFiles = [this.MainCSSFile, "/css/zlink-button.css"]

	IsBrowser: boolean
	Api = new ApiUtils()
	Storage = new Storage()
	TrackQueue = new TrackQueue()
	MapQueue = new MapQueue()
	ErrorSubject = new Subject<Error>()
	Settings = {
		blockQueue: true,
		logQueue: false,
		logMapQueue: false,
		logStateButton: false,
		logTrackPage: false,
		logWatchers: false,
		backendHostname: null,
		backendAuth: null,
		bsaberLogin: null,
		bsaberPassword: null,
		bsaberUsername: null,
		lastSyncTime: 0,
	}

	private redirector: HTMLAnchorElement = null

	public async initialize(isBrowser: boolean) {
		// load all settings
		const settings = Spicetify.LocalStorage.get("beatsaber:settings")
		if (settings) {
			Object.assign(this.Settings, JSON.parse(settings))
		}

		// initialize the database
		await this.Storage.initialize()

		// watch all apps for tracklists
		new AppWatcher(document.body as HTMLBodyElement).connect()

		// subscribe to show errors
		this.ErrorSubject.subscribe((error) => {
			Spicetify.showNotification(error.toString())
		})

		// sync bookmarks and downloads
		setTimeout(this.syncMaps, 5000)

		// add popup button to player footer
		const playerControls = document.querySelector(
			".extra-controls-container"
		)
		playerControls.prepend(PopupPage.getWrapped())

		// add now playing button
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

	public async syncMaps() {
		if (!BeatSaber.Settings.backendHostname) {
			return
		}

		const now = new Date().getTime()
		if (now - BeatSaber.Settings.lastSyncTime < 2 * 24 * 60 * 60 * 1000) {
			return
		}
		BeatSaber.Settings.lastSyncTime = now
		BeatSaber.saveSettings()

		let bookmarkCount = 0

		if (BeatSaber.Settings.bsaberUsername && BeatSaber.Settings) {
			Spicetify.showNotification("Syncing bookmarks...")
			const keys = await BeatSaber.Api.getBookmarkKeys(
				BeatSaber.Settings.bsaberUsername
			)
			const storedKeys = await BeatSaber.Storage.Map.getKeys(
				MapCategory.BOOKMARKED
			)
			const missingPages = new Set<number>()

			keys.forEach((key, index) => {
				if (storedKeys.has(key)) return
				bookmarkCount++
				missingPages.add(Math.floor(index / 20) + 1)
			})

			for (const page of missingPages) {
				Spicetify.showNotification(`Getting bookmarks page ${page}...`)
				const bookmarks = await BeatSaber.Api.getBookmarks(
					BeatSaber.Settings.bsaberUsername,
					page
				)
				await BeatSaber.Storage.Map.put(
					MapCategory.BOOKMARKED,
					...bookmarks
				)
			}
		}

		Spicetify.showNotification("Syncing downloads...")
		const downloads = await BeatSaber.Api.getDownloads()
		await BeatSaber.Storage.Map.put(MapCategory.DOWNLOADED, ...downloads)

		Spicetify.showNotification(
			`Added ${bookmarkCount || "no"} new bookmarks`
		)
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
