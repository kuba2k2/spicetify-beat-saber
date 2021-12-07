import { isHTMLTable } from "../../core/utils"
import { BaseWatcher } from "./BaseWatcher"
import { TracklistTypes } from "./TracklistType"
import { TracklistWatcher } from "./TracklistWatcher"

export class QueueWatcher extends BaseWatcher<HTMLIFrameElement> {
	connect(): void {
		this.observe("#queue-tracklist")
		this.observe("#history-tracklist")
	}

	mount(child: Element): BaseWatcher<Element> {
		if (isHTMLTable(child)) {
			return new TracklistWatcher(child, TracklistTypes.NORMAL)
		}
	}
}
