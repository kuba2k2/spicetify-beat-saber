import { BaseWatcher } from "../BaseWatcher"
import { TracklistWatcher } from "./TracklistWatcher"

export class AppWatcher extends BaseWatcher<HTMLBodyElement> {
	connect(): void {
		this.observe(".Root__main-view .os-content main", {
			subtree: true,
			childList: true,
		})
	}

	mount(child: Element): BaseWatcher<Element>[] {
		const key = child.tagName.toLowerCase() + "." + child.className
		// @ts-ignore
		const pathname: string = Spicetify.Platform.History.location.pathname

		const tracklists = child.querySelectorAll(
			"div.main-trackList-trackList"
		)
		const watchers = []
		tracklists.forEach((node: HTMLDivElement) => {
			watchers.push(new TracklistWatcher(node))
		})

		return watchers
	}
}
