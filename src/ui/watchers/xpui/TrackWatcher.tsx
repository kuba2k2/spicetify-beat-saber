import React from "react"
import ReactDOM from "react-dom"
import { TrackBase } from "../../../core/models/TrackBase"
import URI from "../../../core/models/URI"
import { TrackApp } from "../../apps/TrackApp"
import { BaseWatcher } from "../BaseWatcher"

export class TrackWatcher extends BaseWatcher<HTMLDivElement> {
	rootInner: HTMLDivElement
	timeoutId: NodeJS.Timeout
	connected: boolean

	artists?: string[]
	buttonCell: HTMLDivElement

	connect(): void {
		this.root.classList.add("bs-hover-parent")
		this.rootInner = this.root.querySelector("div")
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
		this.buttonCell = this.root.querySelector(".bs-tl-xpui-cell")
		if (!this.buttonCell) {
			this.buttonCell = document.createElement("div")
			this.buttonCell.classList.add("main-trackList-rowSectionIndex")
			this.buttonCell.classList.add("bs-tl-xpui-cell")
			this.rootInner.prepend(this.buttonCell)
		}
	}

	findProps(props: any, key: string, value: string | null): any | null {
		if (!props) return null
		if (value && props[key] === value) return props
		if (!value && props[key]) return props
		if (!props.children) return null

		if (Array.isArray(props.children)) {
			for (const child of props.children) {
				if (typeof child != "object") continue
				const found = this.findProps(child.props, key, value)
				if (found) return found
			}
			return null
		} else {
			return this.findProps(props.children.props, key, value)
		}
	}

	handleConnect() {
		if (!this.buttonCell) return

		let propsKey = null
		for (const key of Object.keys(this.rootInner)) {
			if (key.includes("reactProps")) {
				propsKey = key
				break
			}
		}
		if (!propsKey) {
			this.log(
				`[${this.constructor.name}] Props not found!`,
				this.rootInner
			)
			return
		}

		const props = this.rootInner[propsKey]
		const trackUri = this.findProps(props, "playAriaLabel", null)
		if (!trackUri) {
			this.log(
				`[${this.constructor.name}] Track URI not found!`,
				this.rootInner
			)
			return
		}

		let artistLink: HTMLAnchorElement = null
		this.root.querySelectorAll("a").forEach((el) => {
			if (!artistLink && el.href.includes("/artist")) artistLink = el
		})
		if (!artistLink || !artistLink.innerText) {
			this.log(
				`[${this.constructor.name}] Artist link not found!`,
				this.rootInner
			)
			return
		}

		const titleText = artistLink.parentElement.parentElement
			.firstElementChild as HTMLElement
		if (!titleText || !titleText.innerText) {
			this.log(
				`[${this.constructor.name}] Title text not found!`,
				this.rootInner
			)
			return
		}

		const uri = URI.from(trackUri.uri)
		const artist = artistLink.innerText.trim()
		const title = titleText.innerText.trim()
		const artists = this.artists ? [...this.artists] : [artist]

		// this.log(
		// 	`[${this.constructor.name}] Props`,
		// 	this.root,
		// 	props,
		// 	uri,
		// 	artists,
		// 	title
		// )

		if (!uri || !artists || !title) return

		if (uri.type != "track") return

		const track: TrackBase = { uri, title, artists }

		BeatSaber.Core.render(<TrackApp trackBase={track} />, this.buttonCell)
	}

	handleDisconnect() {
		ReactDOM.unmountComponentAtNode(this.buttonCell)
	}

	mount(_child: Element): BaseWatcher<Element> {
		throw new Error("Method not implemented.")
	}
}
