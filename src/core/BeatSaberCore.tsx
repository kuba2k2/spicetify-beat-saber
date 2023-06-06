import React, { ReactElement } from "react"
import ReactDOM from "react-dom"
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
import { StyleSheetManager } from "styled-components"

declare global {
	interface Window {
		track: Track
	}
}

export class BeatSaberCore {
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

	private audio: HTMLAudioElement = null
	private redirector: HTMLAnchorElement = null

	public async initialize() {
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

		if (BeatSaber.IsZlink) {
			// add popup button to player footer
			const playerControls = document.querySelector(
				".extra-controls-container"
			)
			playerControls.prepend(this.render(<PopupPage />))
			// add now playing button
			const nowPlayingButton = document.querySelector(
				".nowplaying-add-button"
			)
			nowPlayingButton?.after(
				this.render(<NowPlayingPage />, null, null, "bs-now-playing")
			)
		}

		if (BeatSaber.IsXpui) {
			// add popup button to player footer
			const playerControls = document.querySelector(
				".main-nowPlayingBar-extraControls"
			)
			playerControls?.prepend(this.render(<PopupPage />))
			// add now playing button
			// const nowPlayingButton = document.querySelector(
			// 	".main-addButton-button"
			// )
			// nowPlayingButton?.after(
			// 	this.render(<NowPlayingPage />, null, null, "bs-now-playing")
			// )
		}
	}

	public getAppPage() {
		return <DemoPage />
	}

	public render(
		component: ReactElement,
		window?: Window,
		parent?: HTMLElement,
		parentClass?: string
	) {
		if (!window) {
			window = global.window
		}
		if (!parent) {
			parent = window.document.createElement("div")
			parent.className = parentClass
		}
		ReactDOM.render(
			<StyleSheetManager target={window.document.head}>
				{component}
			</StyleSheetManager>,
			parent
		)
		return parent
	}

	public async syncMaps() {
		if (!BeatSaber.Core.Settings.backendHostname) {
			return
		}

		const now = new Date().getTime()
		if (
			now - BeatSaber.Core.Settings.lastSyncTime <
			2 * 24 * 60 * 60 * 1000
		) {
			return
		}
		BeatSaber.Core.Settings.lastSyncTime = now
		BeatSaber.Core.saveSettings()

		let bookmarkCount = 0

		if (BeatSaber.Core.Settings.bsaberUsername && BeatSaber.Core.Settings) {
			Spicetify.showNotification("Syncing bookmarks...")
			const keys = await BeatSaber.Core.Api.getBookmarkKeys(
				BeatSaber.Core.Settings.bsaberUsername
			)
			const storedKeys = await BeatSaber.Core.Storage.Map.getKeys(
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
				const bookmarks = await BeatSaber.Core.Api.getBookmarks(
					BeatSaber.Core.Settings.bsaberUsername,
					page
				)
				await BeatSaber.Core.Storage.Map.put(
					MapCategory.BOOKMARKED,
					...bookmarks
				)
			}
		}

		Spicetify.showNotification("Syncing downloads...")
		const downloads = await BeatSaber.Core.Api.getDownloads()
		await BeatSaber.Core.Storage.Map.put(
			MapCategory.DOWNLOADED,
			...downloads
		)

		Spicetify.showNotification(
			`Added ${bookmarkCount || "no"} new bookmarks`
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

	public playAudio(url: string) {
		if (!this.audio) {
			this.audio = new Audio()
		}
		if (this.audio.paused || this.audio.src != url) {
			this.audio.src = url
			this.audio.play()
		} else if (!this.audio.paused) {
			this.audio.pause()
		}
	}

	public pauseAudio() {
		this.audio?.pause()
	}
}
