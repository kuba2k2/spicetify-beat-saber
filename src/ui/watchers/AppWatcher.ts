import { isHTMLDiv, isHTMLIFrame } from "../../core/utils"
import { AlbumWatcher } from "./AlbumWatcher"
import { ArtistWatcher } from "./ArtistWatcher"
import { BaseWatcher } from "./BaseWatcher"
import { CollectionSongsWatcher } from "./CollectionSongsWatcher"
import { PlaylistWatcher } from "./PlaylistWatcher"
import { QueueWatcher } from "./QueueWatcher"
import { SearchWatcher } from "./SearchWatcher"
import { StationWatcher } from "./StationWatcher"

export class AppWatcher extends BaseWatcher<HTMLBodyElement> {
	connect(): void {
		this.observe("#view-content")
	}

	prepareIframe(doc: Document) {
		doc?.head?.append(
			...BeatSaber.Core.AdditionalCSSFiles.map((file) => {
				const style = document.createElement("link")
				style.rel = "stylesheet"
				style.href = BeatSaber.BaseUrl + file
				return style
			})
		)
	}

	mount(child: Element): BaseWatcher<Element> {
		const key = child.tagName.toLowerCase() + "#" + child.id

		if (isHTMLIFrame(child)) {
			this.prepareIframe(child.contentDocument)
			child.addEventListener("load", () => {
				this.prepareIframe(child.contentDocument)
			})

			switch (key) {
				case "iframe#app-playlist":
					return new PlaylistWatcher(child)
				case "iframe#app-collection-songs":
					return new CollectionSongsWatcher(child)
				case "iframe#app-station":
					return new StationWatcher(child)
				case "iframe#app-search":
					return new SearchWatcher(child)
				case "iframe#app-artist":
					return new ArtistWatcher(child)
				case "iframe#app-queue":
					return new QueueWatcher(child)
			}
		}

		if (isHTMLDiv(child)) {
			switch (key) {
				case "div#mount-album":
					return new AlbumWatcher(child)
			}
		}
	}
}
