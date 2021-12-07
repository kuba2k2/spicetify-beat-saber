import { BaseWatcher } from "./BaseWatcher"
import { TracklistTypes } from "./TracklistType"
import { TracklistWatcher } from "./TracklistWatcher"

export class SearchWatcher extends BaseWatcher<HTMLIFrameElement> {
	connect(): void {
		this.observe(".App__content.container")
	}

	mount(child: Element): BaseWatcher<Element> {
		if (
			child.tagName == "SECTION" &&
			child.getAttribute("data-interaction-context") == "category-tracks"
		) {
			const table = child.querySelector("table")
			return new TracklistWatcher(table, TracklistTypes.NORMAL)
		}
	}
}
