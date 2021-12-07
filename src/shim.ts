/**
 * The Shim is responsible for resolving the custom apps' URIs, as well as
 * attaching the global CSS and Loader JS to the main window.
 */
function BeatSaberShim() {
	const isBrowser = !navigator.userAgent.includes("Spotify")

	// this somehow helps Spotify find the custom app
	const iframe = document.createElement("iframe")
	iframe.id = "beatsaber-app-resolver"
	iframe.style.display = "none"
	iframe.src = isBrowser ? "https://localhost" : "spotify:app:beatsaber:shim"

	iframe.onload = () => {
		// run the Loader script
		const script = document.createElement("script")
		script.src = "https://beatsaber.app.spotify.com/beatsaber.loader.js"
		// load the stylesheets
		const style = document.createElement("link")
		style.rel = "stylesheet"
		style.href = "https://beatsaber.app.spotify.com/css/beatsaber.css"
		document.head.appendChild(style)
		document.body.appendChild(script)
	}
	document.body.appendChild(iframe)
}

BeatSaberShim()
