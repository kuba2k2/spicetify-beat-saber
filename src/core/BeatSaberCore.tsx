import React, { ReactElement } from "react"
import ReactDOM from "react-dom"
import { Storage } from "./storage/Storage"
import { Track } from "./models/Track"
import { TrackQueue } from "./queue/TrackQueue"
import { DemoApp } from "../ui/apps/DemoApp"
import { AppWatcher as ZlinkWatcher } from "../ui/watchers/zlink/AppWatcher"
import { AppWatcher as XpuiWatcher } from "../ui/watchers/xpui/AppWatcher"
import { PopupApp } from "../ui/apps/PopupApp"
import { NowPlayingApp } from "../ui/apps/NowPlayingApp"
import { MapQueue } from "./queue/MapQueue"
import { Subject } from "rxjs"
import { ApiUtils } from "./api/ApiUtils"
import { MapCategory } from "./storage/MapStorage"
import { StyleSheetManager, ServerStyleSheet } from "styled-components"
import { XpuiModal } from "../ui/components/XpuiModal"
import URI from "./models/URI"
import {
	NotificationData,
	NotificationType,
} from "../ui/components/Notification"

declare global {
	interface Window {
		track: Track
	}
}

export class BeatSaberCore {
	MainCSSFile = `/css/beatsaber.css`
	AdditionalCSSFiles = [this.MainCSSFile]

	IsBrowser: boolean
	Api = new ApiUtils()
	Storage = new Storage()
	TrackQueue = new TrackQueue()
	MapQueue = new MapQueue()
	NotificationSubject = new Subject<NotificationData>()
	Settings = {
		blockQueue: false,
		logQueue: false,
		logMapQueue: false,
		logStateButton: false,
		logTrackPage: false,
		logWatchers: false,
		backendHostname: "localhost:23287",
		backendAuth: null,
		bsaberLogin: null,
		bsaberPassword: null,
		bsaberUsername: null,
		lastSyncTime: 0,
	}
	StyleSheets = new Map<Document, any>()

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
		if (BeatSaber.IsZlink) {
			new ZlinkWatcher(document.body as HTMLBodyElement).connect()
		}
		if (BeatSaber.IsXpui) {
			new XpuiWatcher(document.body as HTMLBodyElement).connect()
		}

		// sync bookmarks and downloads
		setTimeout(async () => {
			try {
				await this.syncMaps()
			} catch (e) {
				this.error(e)
			}
		}, 5000)

		if (BeatSaber.IsZlink) {
			// build icon map
			BeatSaber.Icons = {
				queue: "more",
				search: "search",
				builtin: "offline",
				block: "block",
				x: "x",
				question: "info",
				check: "check-alt",
				tag: "tag",
				download: "download",
				downloaded: "downloaded",
				audio: "playlist",
			}

			// add popup button to player footer
			const playerControls = document.querySelector(
				".extra-controls-container"
			)
			playerControls.prepend(this.render(<PopupApp />))

			// add now playing button
			const nowPlayingButton = document.querySelector(
				".nowplaying-add-button"
			)
			nowPlayingButton?.after(this.render(<NowPlayingApp />))
		}

		if (BeatSaber.IsXpui) {
			// fill missing icons
			// @ts-ignore
			Spicetify.SVGIcons["music"] =
				'<path d="M4 1h11v11.75A2.75 2.75 0 1112.25 10h1.25V2.5h-8v10.25A2.75 2.75 0 112.75 10H4V1zm0 10.5H2.75A1.25 1.25 0 104 12.75V11.5zm9.5 0h-1.25a1.25 1.25 0 101.25 1.25V11.5z"></path>'
			// @ts-ignore
			Spicetify.SVGIcons["help"] =
				'<path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"></path><path d="M7.25 12.026v-1.5h1.5v1.5h-1.5zm.884-7.096A1.125 1.125 0 007.06 6.39l-1.431.448a2.625 2.625 0 115.13-.784c0 .54-.156 1.015-.503 1.488-.3.408-.7.652-.973.818l-.112.068c-.185.116-.26.203-.302.283-.046.087-.097.245-.097.57h-1.5c0-.47.072-.898.274-1.277.206-.385.507-.645.827-.846l.147-.092c.285-.177.413-.257.526-.41.169-.23.213-.397.213-.602 0-.622-.503-1.125-1.125-1.125z"></path>'
			// build icon map
			BeatSaber.Icons = {
				queue: "more",
				search: "search",
				builtin: "offline",
				block: "block",
				x: "x",
				question: "help" as IconType,
				check: "check-alt-fill" as IconType,
				tag: "ticket" as IconType,
				download: "download",
				downloaded: "downloaded",
				audio: "music" as IconType,
			}

			// add popup button to player footer
			const playerControls = document.querySelector(
				".main-nowPlayingBar-extraControls"
			)
			playerControls?.prepend(this.render(<PopupApp />))

			// add now playing button
			const nowPlayingButton = document.querySelector(
				".main-addButton-button"
			)
			nowPlayingButton?.after(this.render(<NowPlayingApp />))
		}
	}

	public getAppPage() {
		return <DemoApp />
	}

	public wrapComponent(component: ReactElement, document: Document) {
		let sheet = this.StyleSheets.get(document)
		if (!sheet) {
			const serverSheet = new ServerStyleSheet()
			// @ts-ignore
			serverSheet.instance.options.isServer = false
			// @ts-ignore
			serverSheet.instance.server = false
			// @ts-ignore
			sheet = serverSheet.instance.reconstructWithOptions({
				target: document.head,
				server: false,
			})
			this.StyleSheets.set(document, sheet)
			console.log("[BeatSaber] Created StyleSheet", sheet, "in", document)
		}

		return <StyleSheetManager sheet={sheet}>{component}</StyleSheetManager>
	}

	public render(
		component: ReactElement,
		parent?: HTMLElement,
		parentClass?: string
	) {
		const document = parent?.ownerDocument ?? window.document
		if (!parent) {
			parent = document.createElement("div")
			parent.className = parentClass
		}
		ReactDOM.render(this.wrapComponent(component, document), parent)
		return parent
	}

	public renderModal(
		options: Omit<Spicetify.ModalParams, "children">,
		...children: React.ReactNode[]
	) {
		options.okLabel = options.okLabel ?? "OK"
		options.isCancelable = options.isCancelable === false ? false : true

		if (BeatSaber.IsZlink) {
			Spicetify.showReactModal({ ...options, children: children })
		}

		if (BeatSaber.IsXpui) {
			XpuiModal.open(document.body, { ...options, children: children })
		}
	}

	public async syncMaps() {
		if (!BeatSaber.Core.Settings.backendHostname) {
			return
		}

		await BeatSaber.Core.Api.checkBackend()

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
			this.notify("Syncing bookmarks...")
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
				this.notify(`Getting bookmarks page ${page}...`)
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

		this.notify("Syncing downloads...")
		const downloads = await BeatSaber.Core.Api.getDownloads()
		await BeatSaber.Core.Storage.Map.put(
			MapCategory.DOWNLOADED,
			...downloads
		)

		this.notify(`Added ${bookmarkCount || "no"} new bookmarks`)
	}

	public saveSettings() {
		Spicetify.LocalStorage.set(
			"beatsaber:settings",
			JSON.stringify(this.Settings)
		)
	}

	public openApp(uri: URI) {
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

	public notify(text: string, type: NotificationType = "info") {
		this.NotificationSubject.next({ type, text })
	}

	public error(error: Error) {
		if (error.toString().includes("status code 500")) {
			error = Error("Couldn't connect to backend")
		} else if (error.toString().includes("status code 404")) {
			error = Error("Please update spicetify-beat-saber-backend")
		} else if (error.toString().includes("status code 400")) {
			error = Error("Check the Beat Saber directory path setting")
		}

		this.NotificationSubject.next({ type: "error", text: error.toString() })
	}
}
