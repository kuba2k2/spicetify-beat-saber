export interface TracklistType {
	hasHeader: boolean
	uriAttribute: string

	headerClass?: string
	headerParentClass?: string

	cellIndex: number
	cellQuery: string
	cellClass: string
	cellHeaderClass?: string

	titleQuery: string

	artistsQuery: string
	artistsQueryUnavailable: string
}

export class TracklistTypes {
	static readonly NORMAL: TracklistType = {
		hasHeader: true,
		uriAttribute: "data-uri",
		headerParentClass: "tl-header",
		cellIndex: 2,
		cellQuery: ".tl-bs",
		cellClass: "tl-cell tl-bs",
		cellHeaderClass: "tl-bs",
		titleQuery: ".tl-name",
		artistsQuery: ".tl-artists > a",
		artistsQueryUnavailable: ".tl-artists > span",
	}
	static readonly PLAYLIST_EXTENDER: TracklistType = {
		hasHeader: false,
		uriAttribute: "data-uri",
		cellIndex: 1,
		cellQuery: ".tl-bs",
		cellClass: "tl-cell tl-bs",
		titleQuery: ".tl-name",
		artistsQuery: ".tl-artists > a",
		artistsQueryUnavailable: ".tl-artists > span",
	}
	static readonly ARTIST_PAGE: TracklistType = {
		hasHeader: true,
		uriAttribute: "data-uri",
		headerParentClass: "tl-header",
		cellIndex: 2,
		cellQuery: ".tl-bs",
		cellClass: "tl-cell tl-bs",
		cellHeaderClass: "tl-bs",
		titleQuery: ".tl-name-with-featured > div > span",
		artistsQuery: ".tl-featuring > a",
		artistsQueryUnavailable: ".tl-featuring > span",
	}
	static readonly ALBUM_REACT: TracklistType = {
		hasHeader: true,
		uriAttribute: "data-ta-uri",
		headerClass: "TableHeaderRow",
		cellIndex: 2,
		cellQuery: ".TableCellBeatSaber",
		cellClass: "TableCell TableCellBeatSaber",
		cellHeaderClass: "TableCellBeatSaber",
		titleQuery: ".TableCellSong__track-name",
		artistsQuery: ".TableCellSong__featuredArtists a",
		artistsQueryUnavailable: ".TableCellSong__featuredArtists span",
	}
}
