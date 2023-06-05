import { BeatSaberCore } from "./src/core/BeatSaberCore"

declare global {
	interface BeatSaberGlobal {
		Core: BeatSaberCore
		Manifest: AppManifest
		React: typeof Spicetify.ReactComponent
		BaseUrl: string
		IsZlink: boolean
		IsXpui: boolean
	}
	interface Window {
		BeatSaber: BeatSaberGlobal
	}
	const BeatSaber: BeatSaberGlobal
}
