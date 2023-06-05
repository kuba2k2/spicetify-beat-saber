import { isHTMLIFrame } from "../../core/utils"

export abstract class BaseWatcher<T extends Element> {
	protected observer: MutationObserver
	protected childWatchers: Map<Node, BaseWatcher<Element>>
	protected root: T

	constructor(root: T) {
		this.observe = this.observe.bind(this)
		this.connect = this.connect.bind(this)
		this.disconnect = this.disconnect.bind(this)
		this.mount = this.mount.bind(this)
		this.handleNodeAdded = this.handleNodeAdded.bind(this)
		this.handleNodeRemoved = this.handleNodeRemoved.bind(this)
		this.childWatchers = new Map()
		this.root = root
	}

	protected log(...data: unknown[]) {
		if (BeatSaber.Core.Settings.logWatchers) {
			console.log(...data)
		}
	}

	protected observe(selector?: string, options?: MutationObserverInit) {
		let target: Element
		if (selector) {
			let parent: Element = this.root
			if (isHTMLIFrame(parent)) {
				parent = parent.contentDocument.body
			}
			target = parent.querySelector(selector)
			if (!target) {
				setTimeout(this.observe.bind(this, selector), 1000)
				return
			}
		} else {
			target = this.root
		}

		this.log(`[${this.constructor.name}] Observing`, target)

		if (!this.observer) {
			this.observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					mutation.addedNodes.forEach(this.handleNodeAdded)
					mutation.removedNodes.forEach(this.handleNodeRemoved)
				})
			})
		}
		this.observer.observe(
			target,
			options || {
				childList: true,
			}
		)
		target.childNodes.forEach(this.handleNodeAdded)
	}

	/**
	 * Attach this watcher to the specified node, creating an observer if appropriate.
	 */
	abstract connect(): void

	/**
	 * Return a new watcher for the specified child,
	 * or alter the child directly. The child is passed
	 * as the node argument to connect() on the returned
	 * watcher.
	 */
	abstract mount(child: Element): BaseWatcher<Element> | undefined

	/**
	 * Cleanup any created child watchers, also disconnect the observer.
	 */
	public disconnect() {
		this.childWatchers.forEach((watcher) => {
			watcher.disconnect()
		})
		this.childWatchers.clear()
		this.observer?.disconnect()
	}

	protected handleNodeAdded(node: Node | Element): void {
		if (!("tagName" in node)) return

		const watcher = this.mount(node)
		if (!watcher) return
		this.childWatchers.set(node, watcher)

		if (
			isHTMLIFrame(node) &&
			node.contentDocument.readyState !== "complete"
		) {
			const listener = () => {
				watcher.connect()
				node.removeEventListener("load", listener)
			}
			node.addEventListener("load", listener)
		} else {
			watcher.connect()
		}
	}

	protected handleNodeRemoved(node: Node | Element): void {
		if (!("tagName" in node)) return

		const watcher = this.childWatchers.get(node)
		if (!watcher) return
		this.childWatchers.delete(node)
		watcher.disconnect()
	}
}
