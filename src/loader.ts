import * as manifest from "../apps/beatsaber/manifest.json"

const globals = ["Spicetify"]

const components = [
	"Button",
	"Card",
	"CardWithoutLink",
	"CircularLoader",
	"HeaderBackgroundImage",
	"HeaderData",
	"Table",
	"TableCell",
	"TableHeaderCell",
	"TableHeaderRow",
	"TableRow",
	"TrackList",
]

const spicetifyClasses = [
	// "BridgeAsync",
	"CosmosAsync",
	"LocalStorage",
	"React",
	"ReactComponent",
	"ReactDOM",
	"URI",
]

function checkGlobals(window: Window) {
	// check globals
	for (const name of globals) {
		if (window[name] === undefined) return false
	}

	// check React components
	if (BeatSaber.IsZlink) {
		for (const name of components) {
			if (window[name] === undefined) return false
		}
	}

	// check Spicetify classes
	for (const name of spicetifyClasses) {
		if (!Spicetify[name]) return false
	}

	return true
}

function importComponents(source: Window) {
	if (BeatSaber.IsZlink) {
		// copy from Window
		for (const name of components) {
			BeatSaber.React[name] = source[name]
		}
	} else {
		// import polyfills
	}
}

/**
 * The Loader script checks the availability of all required globals,
 * and makes everything available in sub-iframes. It also makes
 * the app manifest present in the main window.
 */
function BeatSaberLoader() {
	const url = new URL(location.href)
	// do not initialize the shim-added iframe (spotify:app:beatsaber:shim)
	if (url.searchParams.get("param") === "shim") {
		return
	}

	const isTopWindow = window === window.top
	const isBrowser = !navigator.userAgent.includes("Spotify")

	if (isTopWindow) {
		BeatSaberLoaderTop()
		if (isBrowser) {
			BeatSaberLoaderRender()
		}
	} else {
		BeatSaberLoaderSub()
		BeatSaberLoaderRender()
	}
}

function BeatSaberLoaderTop() {
	console.log("[BeatSaber/Top] Loading version", manifest.BundleVersion)

	// check Spotify type
	const isXpui = window.location.href.includes("xpui.app.spotify.com")
	const baseUrl = isXpui
		? "https://xpui.app.spotify.com/assets/beatsaber"
		: "https://beatsaber.app.spotify.com"

	// build global data object
	window.BeatSaber = {
		Core: undefined,
		// @ts-ignore
		Manifest: manifest,
		// @ts-ignore
		React: {},
		BaseUrl: baseUrl,
		IsZlink: !isXpui,
		IsXpui: isXpui,
	}

	// check if everything is available already
	if (!checkGlobals(window)) {
		setTimeout(BeatSaberLoaderTop, 1000)
		return
	}

	// import React components
	importComponents(window.top)

	// remove the temporary resolver iframe
	if (BeatSaber.IsZlink) {
		const resolverIframe = document.getElementById("beatsaber-app-resolver")
		if (resolverIframe) resolverIframe.remove()
	}

	// run the Main script
	// (not needed in SubApp)
	const script = document.createElement("script")
	script.src = `${BeatSaber.BaseUrl}/beatsaber.bundle.js`
	document.body.appendChild(script)
	console.log("[BeatSaber/Top] Main script injected")

	// load the stylesheets
	// (SubApp has stylesheets in index.html)
	const style = document.createElement("link")
	style.rel = "stylesheet"
	style.href = `${BeatSaber.BaseUrl}/css/beatsaber.css`
	document.head.appendChild(style)
	console.log("[BeatSaber/Top] Main stylesheet injected")
}

function BeatSaberLoaderSub() {
	console.log("[BeatSaber/Sub] Loading version", manifest.BundleVersion)

	// check if the global core is initialized
	if (!window.top.BeatSaber || !window.top.BeatSaber.Core) {
		setTimeout(BeatSaberLoaderSub, 1000)
		return
	}

	// make everything available in this window
	window.BeatSaber = window.top.BeatSaber
	// @ts-ignore
	window.Spicetify = window.top.Spicetify
}

function BeatSaberLoaderRender() {
	// check if the global core is initialized
	if (!window.top.BeatSaber || !window.top.BeatSaber.Core) {
		setTimeout(BeatSaberLoaderRender, 1000)
		return
	}

	// render the app page
	BeatSaber.Core.render(
		BeatSaber.Core.getAppPage(),
		window,
		window.document.getElementById("root")
	)
	console.log("[BeatSaber] App page rendered")
}

BeatSaberLoader()
