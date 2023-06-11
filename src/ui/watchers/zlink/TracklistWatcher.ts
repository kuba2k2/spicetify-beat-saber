import { isHTMLTableRow } from "../../../core/utils"
import { BaseWatcher } from "../BaseWatcher"
import { TracklistType } from "./TracklistType"
import { TrackWatcher } from "./TrackWatcher"

export class TracklistWatcher extends BaseWatcher<HTMLTableElement> {
	type: TracklistType
	artists: string[]

	constructor(
		root: HTMLTableElement,
		type: TracklistType,
		artists?: string[]
	) {
		super(root)
		this.type = type
		this.artists = artists
	}

	connect(): void {
		this.observe("tbody")
		if (this.type.hasHeader) {
			this.observe("thead")
		}
	}

	mount(child: Element): BaseWatcher<Element> {
		if (!isHTMLTableRow(child)) return

		const parent = child.parentNode as Element
		const isHeader =
			(this.type.headerParentClass &&
				parent.className.includes(this.type.headerParentClass)) ||
			(this.type.headerClass &&
				child.className.includes(this.type.headerClass))
		if (isHeader) {
			if (!child.querySelector(this.type.cellQuery)) {
				child.insertCell(this.type.cellIndex).className =
					this.type.cellHeaderClass
			}
			return
		}

		const hasUri = child.hasAttribute(this.type.uriAttribute)
		if (!hasUri) return
		return new TrackWatcher(child, this.type, this.artists)
	}
}
