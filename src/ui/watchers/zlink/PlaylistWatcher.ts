import { isHTMLDiv, isHTMLTable } from "../../../core/utils"
import { BaseWatcher } from "../BaseWatcher"
import { TracklistTypes } from "./TracklistType"
import { TracklistWatcher } from "./TracklistWatcher"

export class PlaylistWatcher extends BaseWatcher<HTMLIFrameElement> {
	connect(): void {
		this.observe("#tracklist")
		this.observe("#playlist-extender")
	}

	mount(child: Element): BaseWatcher<Element> {
		if (isHTMLTable(child)) {
			return new TracklistWatcher(child, TracklistTypes.NORMAL)
		} else if (isHTMLDiv(child)) {
			if (child.className.includes("playlist-extender-content")) {
				const table = child.querySelector("table")
				return new TracklistWatcher(
					table,
					TracklistTypes.PLAYLIST_EXTENDER
				)
			}
		}
	}
}
