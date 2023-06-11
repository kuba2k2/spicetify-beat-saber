import React from "react"
import styled from "styled-components"
import { MapOst } from "../../../core/models/MapOst"
import { TrackHeader } from "../../components/TrackHeader"

type TrackHeaderOstProps = {
	level: MapOst
}

const SubName = styled.span`
	color: white;
`

const Pack = styled.h3`
	margin: 0;
	color: white;
`

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
			<TrackHeader
				title={level.songName}
				label={level.songAuthorName}
				imageUrl={`${BeatSaber.BaseUrl}/levels/${level.cover}.png`}
				backgroundImageUrl={`${BeatSaber.BaseUrl}/levelpacks/${level.pack.cover}.png`}
			>
				<SubName>{level.songSubName}</SubName>
				<br />
				<Pack>{source}</Pack>
			</TrackHeader>
		)
	}
}
