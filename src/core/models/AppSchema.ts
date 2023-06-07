import { Map } from "beastsaber-api/lib/models/Map"
import { MapDetail } from "beatsaver-api/lib/models/MapDetail"
import { DBSchema } from "idb"
import { MapLocal } from "./MapLocal"
import { TrackDB } from "./TrackDB"

export interface AppSchema extends DBSchema {
	track: {
		key: string
		value: TrackDB
	}
	hashNotInterested: {
		key: string
		value: MapDetail
	}
	keyBookmarked: {
		key: string
		value: Map
	}
	hashDownloaded: {
		key: string
		value: MapLocal
	}
}

export type MapType = MapDetail | Map | MapLocal
