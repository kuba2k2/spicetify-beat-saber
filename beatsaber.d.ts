import { BeatSaberCore } from "./src/core/BeatSaberCore"

declare global {
	interface Window {
		BeatSaber: BeatSaberCore
		BeatSaberManifest: AppManifest
	}
	const BeatSaber: BeatSaberCore
	const BeatSaberManifest: AppManifest
}
