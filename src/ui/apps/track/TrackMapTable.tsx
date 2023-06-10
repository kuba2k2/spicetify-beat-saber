import { MapDetail } from "beatsaver-api/lib/models/MapDetail"
import React from "react"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeList as List, ListChildComponentProps } from "react-window"
import styled from "styled-components"
import {
	Characteristic,
	Difficulty,
	DifficultyBadge,
} from "../../components/DifficultyBadge"
import { Button } from "../../controls/Button"
import { ButtonGroup } from "../../controls/ButtonGroup"
import { TrackMapCallbacks, TrackMapSets } from "./TrackMapTypes"

type TrackMapTableProps = {
	maps: MapDetail[]
	scrollNodeRef?: React.RefObject<HTMLDivElement>
} & TrackMapCallbacks &
	TrackMapSets

const Outer = styled.div`
	position: relative;
`

const Table = styled.table`
	border-spacing: 0;
	border-collapse: collapse;
	table-layout: auto;
	width: 100%;
	max-width: 1000px;
	position: relative;
	z-index: 1;
	border-bottom: 1px solid #282828;

	tbody tr:hover {
		background: var(--spice-highlight);
	}

	td,
	th {
		vertical-align: middle !important;
	}
`

const HeaderCell = styled.th<{ $center?: boolean }>`
	padding: 0 0 0 12px;
	color: var(--spice-subtext);
	font-size: 11px;
	font-weight: 400;
	line-height: 28px;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	opacity: 0.7;
	text-align: ${(props) => (props.$center ? "center" : "left")};
`

const BodyCell = styled.td<{ $center?: boolean }>`
	padding: 0 0 0 12px;
	color: var(--spice-subtext);
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	letter-spacing: 0.015em;
	text-transform: none;
	border-top: 1px solid rgba(var(--spice-rgb-text), 0.2);
	user-select: none !important;
	text-align: ${(props) => (props.$center ? "center" : "left")};
`

const ImageCell = styled(BodyCell)`
	padding: 3px 10px;
	width: 80px;

	img {
		width: 60px;
		height: 60px;
		vertical-align: middle;
		border: 0;
	}
`

const RatingCell = styled(BodyCell)`
	white-space: nowrap;

	span:nth-child(1) {
		color: #1db954;

		&:hover {
			color: #1ed760;
		}
	}

	span:nth-child(2) {
		color: #f44336;

		&:hover {
			color: #e57373;
		}
	}
`

const NameCell = styled(BodyCell)`
	padding: 5px 0 8px 12px;
`

const MapperCell = styled(BodyCell)``

const ActionsCell = styled(BodyCell)`
	white-space: nowrap;

	& > div {
		margin: 4px;
	}
`

export class TrackMapTable extends React.Component<TrackMapTableProps> {
	scrollNode: HTMLDivElement

	constructor(props: TrackMapTableProps) {
		super(props)
		this.scrollNode = document.createElement("div")
	}

	render() {
		return (
			<Outer>
				<Table>
					<thead>{this.renderHeaderRow()}</thead>
					<tbody>
						{this.props.maps.map((map) => this.renderRow(map))}
					</tbody>
				</Table>
			</Outer>
		)
	}

	componentDidMount() {
		this.forceUpdate()
	}

	handleMatchesChange(map: MapDetail, index: number) {
		switch (index) {
			case 0:
				if (this.props.onMatchClick) this.props.onMatchClick(map)
				break
			case 1:
				if (this.props.onDoesntMatchClick)
					this.props.onDoesntMatchClick(map)
				break
			case 2:
				if (this.props.onNotInterestedClick)
					this.props.onNotInterestedClick(map)
				break
		}
	}

	renderHeaderRow() {
		return (
			<tr>
				<HeaderCell />
				<HeaderCell $center>Rating</HeaderCell>
				<HeaderCell>Name</HeaderCell>
				<HeaderCell>Mapper</HeaderCell>
				<HeaderCell $center>Actions</HeaderCell>
			</tr>
		)
	}

	renderRow(map: MapDetail) {
		const hash = map.versions[0].hash

		const matches = this.props.matchHashes?.has(hash)
		const notInterested = this.props.notInterestedHashes?.has(hash)

		const bookmarked = this.props.bookmarkedKeys?.has(map.id)
		const bookmarking = this.props.bookmarkingKeys?.has(map.id)
		const downloaded = this.props.downloadedHashes?.has(hash)
		const downloading = this.props.downloadingHashes?.has(hash)
		const showButtonGroup = !!this.props.matchHashes

		// TrackMapRow
		const mapUrl = `https://beatsaver.com/maps/${map.id}`
		const uploaderUrl = `https://beatsaver.com/profile/${map.uploader.id}`
		const score = (map.stats.score * 100).toFixed(0)

		const diffs = [] as React.ReactNode[]
		map.versions[0].diffs.forEach((diff, index) => {
			const tooltip = `${diff.nps.toFixed(2)} NPS / ${
				diff.notes
			} Notes (${diff.characteristic})`
			if (index % 7 === 0) {
				diffs.push(<div style={{ clear: "both" }}></div>)
			}
			diffs.push(
				<DifficultyBadge
					characteristic={
						diff.characteristic.toLowerCase() as Characteristic
					}
					difficulty={diff.difficulty.toLowerCase() as Difficulty}
					tooltip={tooltip}
				/>
			)
		})

		return (
			<tr key={map.id}>
				<ImageCell $center>
					<img src={map.versions[0].coverURL} />
				</ImageCell>

				<RatingCell $center>
					<span>{map.stats.upvotes}</span>
					&nbsp;/&nbsp;
					<span>{map.stats.downvotes}</span>
					&nbsp;({score}%)
				</RatingCell>

				<NameCell>
					<a href={mapUrl}>{map.name}</a>
					{diffs}
				</NameCell>

				<MapperCell>
					<a href={uploaderUrl}>{map.uploader.name}</a>
				</MapperCell>

				<ActionsCell $center>
					{this.props.onPreviewClick && (
						<Button
							type="icon"
							icon="play"
							tooltip="Preview map"
							activeColor="secondary"
							onClick={this.props.onPreviewClick.bind(this, map)}
						/>
					)}

					{this.props.onPlayClick && (
						<Button
							type="icon"
							icon={BeatSaber.Icons.audio}
							tooltip="Preview audio"
							activeColor="secondary"
							onClick={this.props.onPlayClick.bind(this, map)}
						/>
					)}

					{this.props.onBookmarkClick && (
						<Button
							type="icon"
							icon={
								bookmarked
									? "bs-bookmark-filled"
									: "bs-bookmark"
							}
							tooltip="Bookmark"
							activeColor="secondary"
							isActive={bookmarked === true}
							isDisabled={bookmarking}
							onClick={this.props.onBookmarkClick.bind(this, map)}
						/>
					)}
					{this.props.onDownloadClick && (
						<Button
							type="icon"
							icon={downloaded ? "downloaded" : "download"}
							tooltip="Download"
							activeColor="secondary"
							isActive={downloaded === true}
							isDisabled={downloading}
							onClick={this.props.onDownloadClick.bind(this, map)}
						/>
					)}

					{showButtonGroup && (
						<ButtonGroup
							selectedIndex={notInterested ? 2 : matches ? 0 : 1}
							onChange={this.handleMatchesChange.bind(this, map)}
						>
							{["Matches", BeatSaber.Icons.check]}
							{["Doesn't match", BeatSaber.Icons.x]}
							{["Not interested", BeatSaber.Icons.block]}
						</ButtonGroup>
					)}
				</ActionsCell>
			</tr>
		)
	}
}
