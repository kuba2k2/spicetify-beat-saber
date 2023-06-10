import { BeatSaberCore } from "./src/core/BeatSaberCore"

declare global {
	interface BeatSaberGlobal {
		Core: BeatSaberCore
		Manifest: AppManifest
		BaseUrl: string
		IsZlink: boolean
		IsXpui: boolean
		Icons: {[key in StateIconType]: IconType}
	}
	interface Window {
		BeatSaber: BeatSaberGlobal
	}
	const BeatSaber: BeatSaberGlobal

	type IconType =
		"bs-360degree" |
		"bs-lightshow" |
		"bs-lawless" |
		"bs-90degree" |
		"bs-onesaber" |
		"bs-standard" |
		"bs-bookmark" |
		"bs-bookmark-filled" |
		"bs-note" |
		"bs-noarrows" |
		Spicetify.Model.Icon

	type StateIconType =
		"queue" |
		"search" |
		"builtin" |
		"block" |
		"x" |
		"question" |
		"check" |
		"tag" |
		"download" |
		"downloaded"
}
