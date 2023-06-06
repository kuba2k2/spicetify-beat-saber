import React from "react"
import ReactDOM from "react-dom"
import { TrackBase } from "../../core/models/TrackBase"
import { StateButton } from "../components/StateButton"
import { BaseWatcher } from "./BaseWatcher"
import { TracklistType } from "./TracklistType"

export class TrackWatcher extends BaseWatcher<HTMLTableRowElement> {
	timeoutId: NodeJS.Timeout
	connected: boolean

	type: TracklistType
	artists?: string[]
	buttonCell: HTMLTableCellElement

	constructor(
		root: HTMLTableRowElement,
		type: TracklistType,
		artists?: string[]
	) {
		super(root)
		this.type = type
		this.artists = artists
	}

	connect(): void {
		clearTimeout(this.timeoutId)
		this.timeoutId = setTimeout(() => {
			this.connected = true
			this.handleConnect()
		}, 500)
		this.insertCell()
	}

	disconnect() {
		clearTimeout(this.timeoutId)
		if (this.connected) {
			this.handleDisconnect()
		}
	}

	insertCell() {
		this.buttonCell = this.root.querySelector(this.type.cellQuery)
		if (!this.buttonCell) {
			this.buttonCell = this.root.insertCell(this.type.cellIndex)
			this.buttonCell.className = this.type.cellClass
		}
	}

	handleConnect() {
		if (!this.buttonCell) return

		const uri = Spicetify.URI.fromString(
			this.root.getAttribute(this.type.uriAttribute)
		)
		let artists = this.artists ? [...this.artists] : []
		const title = this.root
			.querySelector(this.type.titleQuery)
			?.textContent?.trim()

		const query = this.root.classList.contains("unavailable")
			? this.type.artistsQueryUnavailable
			: this.type.artistsQuery
		this.root.querySelectorAll(query)?.forEach((artist) => {
			if (!artist?.textContent) return
			artists.push(artist.textContent.trim())
		})

		artists = artists.filter((artist) => !!artist)

		if (!uri || !artists.length || !title) return

		if (!Spicetify.URI.isTrack(uri)) return

		const track: TrackBase = { uri, title, artists }

		BeatSaber.Core.render(
			<StateButton trackBase={track} />,
			window,
			this.buttonCell
		)
	}

	handleDisconnect() {
		ReactDOM.unmountComponentAtNode(this.buttonCell)
	}

	mount(_child: Element): BaseWatcher<Element> {
		throw new Error("Method not implemented.")
	}
}
