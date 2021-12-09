import * as manifest from "../apps/beatsaber/manifest.json"

const globals = [
	"React",
	"ReactComponent",
	"ReactDOM",
	"Redux",
	"ReduxStore",
	"Spicetify",
	"Webpack",
	"Button",
	"Card",
	"CardWithoutLink",
	"CircularLoader",
	"GlueToggle",
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
	"BridgeAsync",
	"CosmosAsync",
	"LocalStorage",
	"React",
	"ReactComponent",
	"ReactDOM",
	"Redux",
	"ReduxStore",
	"URI",
]

function checkGlobals(window: Window) {
	for (const name of globals) {
		if (!window[name]) return false
	}
	for (const name of spicetifyClasses) {
		if (!Spicetify[name]) return false
	}
	return true
}

function copyGlobals(source: Window, target: Window) {
	for (const name of globals) {
		target[name] = source[name]
	}
}

function tryResolve(app: string) {
	const iframe = document.createElement("iframe")
	iframe.style.display = "none"
	iframe.src = `spotify:app:${app}:loader`
	iframe.onload = () => {
		iframe.remove()
	}
	document.body.appendChild(iframe)
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

	if (isTopWindow) {
		console.log("[BeatSaber/Top] Loading version", manifest.BundleVersion)
		// check if everything is available already
		if (!checkGlobals(window)) {
			setTimeout(BeatSaberLoader, 1000)
			return
		}

		// remove the temporary resolver iframe
		const resolverIframe = document.getElementById("beatsaber-app-resolver")
		if (resolverIframe) resolverIframe.remove()
	} else {
		console.log(
			"[BeatSaber/SubApp] Loading version",
			manifest.BundleVersion
		)
		// check if the global core is initialized
		if (!window.top.BeatSaber) {
			setTimeout(BeatSaberLoader, 1000)
			return
		}
		// make everything available in this window
		copyGlobals(window.top, window)
		window.BeatSaber = window.top.BeatSaber
	}

	// store the app manifest globally (ignore missing property errors)
	// @ts-ignore
	window.BeatSaberManifest = manifest

	// run the Main script
	const script = document.createElement("script")
	script.src = "https://beatsaber.app.spotify.com/beatsaber.bundle.js"
	document.body.appendChild(script)

	// try to resolve additional iframes
	tryResolve("beatsaber-assets")

	console.log("[BeatSaber] Main script injected")
}

BeatSaberLoader()
