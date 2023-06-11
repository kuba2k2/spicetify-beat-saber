import { isHTMLDiv } from "../../../core/utils"
import { BaseWatcher } from "../BaseWatcher"
import { TracklistTypes } from "./TracklistType"
import { TracklistWatcher } from "./TracklistWatcher"

export class AlbumWatcher extends BaseWatcher<HTMLDivElement> {
	connect(): void {
		this.observe()
	}

	mount(child: Element): BaseWatcher<Element> {
		if (!isHTMLDiv(child)) return

		const stickyHeaderRow = <HTMLTableRowElement>(
			child.querySelector("table.Table__sticky-header-table > thead > tr")
		)
		if (!stickyHeaderRow.querySelector(".TableCellBeatSaber")) {
			stickyHeaderRow.insertCell(2).className = "TableCellBeatSaber"
		}

		const artists = []
		child
			.querySelectorAll(".AlbumMetaInfo__artists a")
			?.forEach((artist) => {
				if (!artist?.textContent) return
				artists.push(artist.textContent.trim())
			})

		const table = <HTMLTableElement>child.querySelector(".Table > table")

		if (!artists.length && child.querySelector(".AlbumMetaInfo__artists")) {
			// probably a compilation
			return new TracklistWatcher(
				table,
				TracklistTypes.ALBUM_REACT_COMPILATION
			)
		}

		return new TracklistWatcher(table, TracklistTypes.ALBUM_REACT, artists)
	}
}
