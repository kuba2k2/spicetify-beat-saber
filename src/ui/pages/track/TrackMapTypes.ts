import { MapDetail } from "beatsaver-api/lib/models/MapDetail"

export type TrackMapCallbacks = {
	onMatchClick?: (map: MapDetail) => void
	onDoesntMatchClick?: (map: MapDetail) => void
	onNotInterestedClick?: (map: MapDetail) => void
	onPreviewClick?: (map: MapDetail) => void
	onPlayClick?: (map: MapDetail) => void
	onBookmarkClick?: (map: MapDetail) => void
	onDownloadClick?: (map: MapDetail) => void
}

export type TrackMapSets = {
	matchHashes?: Set<string>
	notInterestedHashes?: Set<string>
	bookmarkedKeys?: Set<string>
	bookmarkingKeys?: Set<string>
	downloadedHashes?: Set<string>
	downloadingHashes?: Set<string>
}
