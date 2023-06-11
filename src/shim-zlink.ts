/**
 * The Shim is responsible for resolving the custom apps' URIs, as well as
 * attaching the Loader JS to the main window.
 * It is used on Zlink only.
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
		document.body.appendChild(script)
	}
	document.body.appendChild(iframe)
}

BeatSaberShim()
