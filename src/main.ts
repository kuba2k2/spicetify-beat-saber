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
	// import the core module
	import("./core/BeatSaberCore").then(({ BeatSaberCore }) => {
		// make it a singleton
		window.BeatSaber.Core = new BeatSaberCore()
		// run the core
		BeatSaber.Core.initialize()
	})
}

BeatSaberMain()
