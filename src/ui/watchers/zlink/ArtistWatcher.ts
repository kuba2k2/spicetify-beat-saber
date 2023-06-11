import { isHTMLDiv, isHTMLListItem } from "../../../core/utils"
import { BaseWatcher } from "../BaseWatcher"
import { TracklistTypes } from "./TracklistType"
import { TracklistWatcher } from "./TracklistWatcher"

export class ArtistWatcher extends BaseWatcher<HTMLIFrameElement> {
	artist: string

	connect(): void {
		this.observe("#artist-page", {
			subtree: true,
			childList: true,
		})
	}

	mount(child: Element): BaseWatcher<Element> {
		if (isHTMLDiv(child) && child.id == "header") {
			this.artist = child
				.querySelector("span.glue-page-header__title-text")
				?.textContent?.trim()
			return
		}

		if (isHTMLListItem(child)) {
			if (!child.hasAttribute("data-index")) return
			const table = <HTMLTableElement>(
				child.querySelector("div.album-playlist > table")
			)
			return new TracklistWatcher(table, TracklistTypes.ARTIST_PAGE, [
				this.artist,
			])
		}

		if (isHTMLDiv(child) && child.id == "content") {
			const table = <HTMLTableElement>(
				child.querySelector("#toplist-row table")
			)
			return new TracklistWatcher(table, TracklistTypes.NORMAL, [
				this.artist,
			])
		}
	}
}
