import { isHTMLDiv } from "../../../core/utils"
import { BaseWatcher } from "../BaseWatcher"
import { TrackWatcher } from "./TrackWatcher"

export class TracklistWatcher extends BaseWatcher<HTMLDivElement> {
	connect() {
		this.root.setAttribute("data-bs", "tl")
		if (this.root.querySelector(".main-trackList-trackListHeader"))
			this.observe(".main-trackList-trackListHeader")
		this.observe(".main-rootlist-wrapper > div:not([class])")
	}

	mount(child: Element): BaseWatcher<Element> {
		if (!isHTMLDiv(child)) return
		if (child.getAttribute("role") !== "row") return
		this.log(`[${this.constructor.name}] Row mounted`, child)

		const rowIndex = child.getAttribute("aria-rowindex")

		if (rowIndex == "1" && child.childElementCount > 1) {
			const headerCell = document.createElement("div")
			headerCell.className = "main-trackList-rowSectionIndex"
			headerCell.innerHTML = ""
			child.prepend(headerCell)
			return
		}

		return new TrackWatcher(child)
	}
}
