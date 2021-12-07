import { isHTMLDiv } from "../../core/utils"
import { BaseWatcher } from "./BaseWatcher"
import { TracklistTypes } from "./TracklistType"
import { TracklistWatcher } from "./TracklistWatcher"

export class StationWatcher extends BaseWatcher<HTMLIFrameElement> {
	connect(): void {
		this.observe(".track-list-container")
	}

	mount(child: Element): BaseWatcher<Element> {
		if (
			isHTMLDiv(child) &&
			child.className.includes("tracklist-station-container")
		) {
			const table = child.querySelector("table")
			return new TracklistWatcher(table, TracklistTypes.NORMAL)
		}
	}
}
