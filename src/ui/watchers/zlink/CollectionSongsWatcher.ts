import { isHTMLTable } from "../../../core/utils"
import { BaseWatcher } from "../BaseWatcher"
import { TracklistTypes } from "./TracklistType"
import { TracklistWatcher } from "./TracklistWatcher"

export class CollectionSongsWatcher extends BaseWatcher<HTMLIFrameElement> {
	connect(): void {
		this.observe("#list-placeholder div")
	}

	mount(child: Element): BaseWatcher<Element> {
		if (isHTMLTable(child)) {
			return new TracklistWatcher(child, TracklistTypes.NORMAL)
		}
	}
}
