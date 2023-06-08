import React from "react"
import { MapOst } from "../../../core/models/MapOst"

type TrackHeaderOstProps = {
	level: MapOst
}

export class TrackHeaderOst extends React.Component<TrackHeaderOstProps> {
	render() {
		const level = this.props.level
		let source: string
		if (level.pack.isDLC) {
			source = `DLC level (${level.pack.name})`
		} else if (level.pack.isOST) {
			source = level.pack.name
		} else {
			source = `Built-in level (${level.pack.name})`
		}

		return (
			<div className="bs-builtin-header">
				<BeatSaber.React.HeaderData
					uri="spotify:app:beatsaber"
					title={level.songName}
					label={level.songAuthorName}
					metaInfo={
						<div>
							<span className="bs-builtin-subname">
								{level.songSubName}
							</span>
							<br />
							<h3 className="bs-builtin-pack">{source}</h3>
						</div>
					}
					imageUrl={`${BeatSaber.BaseUrl}/levels/${level.cover}.png`}
					backgroundType="image"
					backgroundImageUrl={`${BeatSaber.BaseUrl}/levelpacks/${level.pack.cover}.png`}
					hideAddButton={true}
					hidePlayButton={true}
					scrollNode={document.createElement("div")}
				/>
			</div>
		)
	}
}
