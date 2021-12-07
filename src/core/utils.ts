export function getSlug(s: string): string {
	return s
		.toLowerCase()
		.replace(/[^\w ]+/g, "")
		.replace(/ +/g, "-")
}

export function isHTMLIFrame(x: unknown): x is HTMLIFrameElement {
	return x && x.constructor && x.constructor.name == "HTMLIFrameElement"
}

export function isHTMLDiv(x: unknown): x is HTMLDivElement {
	return x && x.constructor && x.constructor.name == "HTMLDivElement"
}

export function isHTMLTable(x: unknown): x is HTMLTableElement {
	return x && x.constructor && x.constructor.name == "HTMLTableElement"
}

export function isHTMLTableRow(x: unknown): x is HTMLTableRowElement {
	return x && x.constructor && x.constructor.name == "HTMLTableRowElement"
}

export function isHTMLListItem(x: unknown): x is HTMLLIElement {
	return x && x.constructor && x.constructor.name == "HTMLLIElement"
}

declare global {
	interface Array<T> {
		minus: (arr: T[]) => T[]
		intersect: (arr: T[]) => T[]
		includesAny: (arr: T[]) => boolean
	}

	interface Set<T> {
		addAll: (iter: Iterable<T>) => Set<T>
		deleteAll: (iter: Iterable<T>) => Set<T>
		concat: (iter: Iterable<T>) => Set<T>
		minus: (iter: Iterable<T>) => Set<T>
		intersect: (iter: Iterable<T>) => Set<T>
		hasAny: (iter: Iterable<T>) => boolean
	}
}

Array.prototype.minus = function <T>(this: T[], arr: T[]) {
	return this.filter((x: T) => !arr.includes(x))
}

Array.prototype.intersect = function <T>(this: T[], arr: T[]) {
	return this.filter((x: T) => arr.includes(x))
}

Array.prototype.includesAny = function <T>(this: T[], arr: T[]) {
	return this.some((x: T) => arr.includes(x))
}

Set.prototype.addAll = function <T>(this: Set<T>, iter: Iterable<T>) {
	for (const x of iter) {
		this.add(x)
	}
	return this
}

Set.prototype.deleteAll = function <T>(this: Set<T>, iter: Iterable<T>) {
	for (const x of iter) {
		this.delete(x)
	}
	return this
}

Set.prototype.concat = function <T>(this: Set<T>, iter: Iterable<T>) {
	return new Set(this).addAll(iter)
}

Set.prototype.minus = function <T>(this: Set<T>, iter: Iterable<T>) {
	return new Set(this).deleteAll(iter)
}

Set.prototype.intersect = function <T>(this: Set<T>, iter: Iterable<T>) {
	const set = new Set()
	for (const x of iter) {
		if (this.has(x)) set.add(x)
	}
	return set
}

Set.prototype.hasAny = function <T>(this: Set<T>, iter: Iterable<T>) {
	for (const x of iter) {
		if (this.has(x)) return true
	}
	return false
}
