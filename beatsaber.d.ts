import { BeatSaberCore } from "./src/core/BeatSaberCore"

declare global {
	interface Window {
		BeatSaber: BeatSaberCore
	}
	const BeatSaber: BeatSaberCore
}
