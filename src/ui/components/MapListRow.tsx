import { MapDetail } from "beatsaver-api/lib/models/MapDetail"
import { ButtonGroup } from "./ButtonGroup"
import { Characteristic, Difficulty, DifficultyBadge } from "./DifficultyBadge"
import { MapListCallbacks } from "./MapListTypes"

type MapListRowProps = {
	map: MapDetail
	showButtonGroup: boolean

	matches?: boolean
	notInterested?: boolean
	bookmarked?: boolean | null
	downloaded?: boolean | null
} & MapListCallbacks

export class MapListRow extends Spicetify.React.Component<MapListRowProps> {
	constructor(props: MapListRowProps) {
		super(props)
		this.handleMatchesChange = this.handleMatchesChange.bind(this)
		this.handleBookmarkClick = this.handleBookmarkClick.bind(this)
		this.handleDownloadClick = this.handleDownloadClick.bind(this)
	}

	handleMatchesChange(index: number) {
		switch (index) {
			case 0:
				if (this.props.onMatchClick)
					this.props.onMatchClick(this.props.map)
				break
			case 1:
				if (this.props.onDoesntMatchClick)
					this.props.onDoesntMatchClick(this.props.map)
				break
			case 2:
				if (this.props.onNotInterestedClick)
					this.props.onNotInterestedClick(this.props.map)
				break
		}
	}

	handleBookmarkClick() {
		this.props.onBookmarkClick(this.props.map)
	}

	handleDownloadClick() {
		this.props.onDownloadClick(this.props.map)
	}

	render() {
		const map = this.props.map
		const mapUrl = `https://beatsaver.com/maps/${map.id}`
		const uploaderUrl = `https://beatsaver.com/profile/${map.uploader.id}`
		const score = (map.stats.score * 100).toFixed(0)

		const diffs = [] as Spicetify.React.ReactNode[]
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
			<TableRow
				rowId={map.id}
				extraClassName="bs-ml-row"
				isPlayable={false}
				isTrackPlaying={false}
			>
				<TableCell align="center" extraClassName="bs-ml-image">
					<img src={map.versions[0].coverURL} />
				</TableCell>

				<TableCell align="center" extraClassName="bs-ml-rating">
					<span className="bs-green">{map.stats.upvotes}</span>
					&nbsp;/&nbsp;
					<span className="bs-red">{map.stats.downvotes}</span>
					&nbsp;({score}%)
				</TableCell>

				<TableCell extraClassName="bs-ml-name">
					<a href={mapUrl}>{map.name}</a>
					{diffs}
				</TableCell>

				<TableCell extraClassName="bs-ml-mapper">
					<a href={uploaderUrl}>{map.uploader.name}</a>
				</TableCell>

				<TableCell align="center" extraClassName="bs-ml-actions">
					<Button type="icon" icon="play" tooltip="Preview map" />
					<Button
						type="icon"
						icon="playlist"
						tooltip="Preview audio"
					/>
					{this.props.onBookmarkClick && (
						<Button
							type="icon"
							ta-id={
								this.props.bookmarked
									? "bs-icon-bookmark-filled"
									: "bs-icon-bookmark"
							}
							tooltip="Bookmark"
							isActive={this.props.bookmarked === true}
							isDisabled={this.props.bookmarked === null}
							onClick={this.handleBookmarkClick}
						/>
					)}
					{this.props.onDownloadClick && (
						<Button
							type="icon"
							icon={
								this.props.downloaded
									? "downloaded"
									: "download"
							}
							tooltip="Download"
							isActive={this.props.downloaded === true}
							isDisabled={this.props.downloaded === null}
							onClick={this.handleDownloadClick}
						/>
					)}

					{this.props.showButtonGroup && (
						<ButtonGroup
							selectedIndex={
								this.props.notInterested
									? 2
									: this.props.matches
									? 0
									: 1
							}
							onChange={this.handleMatchesChange}
						>
							{["Matches", "check-alt"]}
							{["Doesn't match", "x"]}
							{["Not interested", "block"]}
						</ButtonGroup>
					)}
				</TableCell>
			</TableRow>
		)
	}
}
