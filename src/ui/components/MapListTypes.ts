import { MapDetail } from "beatsaver-api/lib/models/MapDetail"

export type MapListCallbacks = {
	onMatchClick?: (map: MapDetail) => void
	onDoesntMatchClick?: (map: MapDetail) => void
	onNotInterestedClick?: (map: MapDetail) => void
	onBookmarkClick?: (map: MapDetail) => void
	onDownloadClick?: (map: MapDetail) => void
}

export type MapListSets = {
	matchHashes?: Set<string>
	notInterestedHashes?: Set<string>
	bookmarkedKeys?: Set<string>
	bookmarkingKeys?: Set<string>
	downloadedHashes?: Set<string>
	downloadingHashes?: Set<string>
}
