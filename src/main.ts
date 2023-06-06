/// <reference path="../types/spicetify.d.ts" />
/// <reference path="../types/spicetify-apis.d.ts" />
/// <reference path="../types/spicetify-player.d.ts" />
/// <reference path="../types/spicetify-react.d.ts" />
/// <reference path="../types/spicetify-react-component.d.ts" />
/// <reference path="../types/spicetify-uri.d.ts" />
/// <reference path="../beatsaber.d.ts" />

/**
 * This is the main entrypoint of the application.
 */
function BeatSaberMain() {
	const isTopWindow = window === window.top
	const isBrowser = !navigator.userAgent.includes("Spotify")

	if (isTopWindow) {
		// import the core module
		import("./core/BeatSaberCore").then(({ BeatSaberCore }) => {
			// make it a singleton
			window.BeatSaber.Core = new BeatSaberCore()
			// run the core
			BeatSaber.Core.initialize()
		})
		if (!isBrowser) {
			// do not mount the sub-application in Spotify main window
			return
		}
	}

	// run the sub-application
	BeatSaber.Core.render(
		BeatSaber.Core.getAppPage(),
		window,
		window.document.getElementById("root")
	)
}

BeatSaberMain()
