import React from "react"
import { Track } from "../../../core/models/Track"
import { TrackHeader } from "../../components/TrackHeader"

type TrackHeaderCustomProps = {
	track: Track
}

export class TrackHeaderCustom extends React.Component<TrackHeaderCustomProps> {
	render() {
		const track = this.props.track
		let artistImage: string
		if (track.artistImage) {
			artistImage = track.artistImage.toImageURL()
		}

		return (
			<TrackHeader
				title={track.title}
				label={track.getArtist()}
				imageUrl={track.imageUri?.toImageURL()}
				backgroundImageUrl={artistImage}
			/>
		)
	}
}
