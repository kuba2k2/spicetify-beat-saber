import { MapDetail } from "beatsaver-api/lib/models/MapDetail";
import { MapListRow } from "./MapListRow";

type MapListTableProps = {
	maps: MapDetail[]
	matchHashes?: Set<string>
	notInterestedHashes?: Set<string>
	onMatchClick?: (map: MapDetail) => void
	onDoesntMatchClick?: (map: MapDetail) => void
	onNotInterestedClick?: (map: MapDetail) => void
	scrollNodeRef?: Spicetify.React.RefObject<HTMLDivElement>
}

export class MapListTable extends Spicetify.React.Component<MapListTableProps> {
	scrollNode: HTMLDivElement

	constructor(props: MapListTableProps) {
		super(props)
		this.scrollNode = document.createElement("div")
	}

	render() {
		const maps = this.props.maps
		const rowIds = maps.map((map) => map.id);
		const rowIdToIndexMap = new Map(maps.map((map, index) => [map.id, index]))
		return (
			<Table
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
			></Table>
		)
	}

	componentDidMount() {
		this.forceUpdate()
	}

	renderHeaderRow() {
		return (
			<TableHeaderRow extraClassName="bs-ml-header">
				<TableHeaderCell extraClassName="bs-ml-image" label="" />
				<TableHeaderCell extraClassName="bs-ml-rating" align="center" label="Rating" />
				<TableHeaderCell extraClassName="bs-ml-name" label="Name" />
				<TableHeaderCell extraClassName="bs-ml-mapper" label="Mapper" />
				<TableHeaderCell extraClassName="bs-ml-actions" align="center" label="Actions" />
			</TableHeaderRow>
		)
	}

	renderRow(rowIndex: number) {
		const map = this.props.maps[rowIndex];
		const matches = this.props.matchHashes && this.props.matchHashes.has(map.versions[0].hash)
		const notInterested = this.props.notInterestedHashes && this.props.notInterestedHashes.has(map.versions[0].hash)

		return <MapListRow
			map={map}
			showButtonGroup={!!this.props.matchHashes}
			matches={matches}
			notInterested={notInterested}
			onMatchClick={this.props.onMatchClick}
			onDoesntMatchClick={this.props.onDoesntMatchClick}
			onNotInterestedClick={this.props.onNotInterestedClick} />
	}
}
