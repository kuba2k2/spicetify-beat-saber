import { MapDetail } from "beatsaver-api/lib/models/MapDetail"
import { MapListCallbacks, MapListSets } from "./MapListTypes"
import { MapListRow } from "./MapListRow"

type MapListTableProps = {
	maps: MapDetail[]
	scrollNodeRef?: Spicetify.React.RefObject<HTMLDivElement>
} & MapListCallbacks &
	MapListSets

export class MapListTable extends Spicetify.React.Component<MapListTableProps> {
	scrollNode: HTMLDivElement

	constructor(props: MapListTableProps) {
		super(props)
		this.scrollNode = document.createElement("div")
	}

	render() {
		const maps = this.props.maps
		const rowIds = maps.map((map) => map.id)
		const rowIdToIndexMap = new Map(
			maps.map((map, index) => [map.id, index])
		)
		return (
			<BeatSaber.React.Table
				renderRow={this.renderRow.bind(this)}
				renderHeaderRow={this.renderHeaderRow}
				rowIds={rowIds}
				rowIdToIndexMap={rowIdToIndexMap}
				rowCount={maps.length}
				taId="bs-ml"
				scrollNode={this.scrollNode}
				rowCountScrollerThreshold={100}
				stickyTableHeaderOffsetTop={0}
				sumOfStickyElementHeights={0}
				rowHeight={41}
			></BeatSaber.React.Table>
		)
	}

	componentDidMount() {
		this.forceUpdate()
	}

	renderHeaderRow() {
		return (
			<BeatSaber.React.TableHeaderRow extraClassName="bs-ml-header">
				<BeatSaber.React.TableHeaderCell
					extraClassName="bs-ml-image"
					label=""
				/>
				<BeatSaber.React.TableHeaderCell
					extraClassName="bs-ml-rating"
					align="center"
					label="Rating"
				/>
				<BeatSaber.React.TableHeaderCell
					extraClassName="bs-ml-name"
					label="Name"
				/>
				<BeatSaber.React.TableHeaderCell
					extraClassName="bs-ml-mapper"
					label="Mapper"
				/>
				<BeatSaber.React.TableHeaderCell
					extraClassName="bs-ml-actions"
					align="center"
					label="Actions"
				/>
			</BeatSaber.React.TableHeaderRow>
		)
	}

	renderRow(rowIndex: number) {
		const map = this.props.maps[rowIndex]
		const hash = map.versions[0].hash

		const matches = this.props.matchHashes?.has(hash)
		const notInterested = this.props.notInterestedHashes?.has(hash)

		const bookmarked = this.props.bookmarkedKeys?.has(map.id)
		const bookmarking = this.props.bookmarkingKeys?.has(map.id)
		const downloaded = this.props.downloadedHashes?.has(hash)
		const downloading = this.props.downloadingHashes?.has(hash)

		return (
			<MapListRow
				map={map}
				showButtonGroup={!!this.props.matchHashes}
				matches={matches}
				notInterested={notInterested}
				bookmarked={bookmarking ? null : bookmarked}
				downloaded={downloading ? null : downloaded}
				// pass MapListCallbacks
				{...this.props}
			/>
		)
	}
}
