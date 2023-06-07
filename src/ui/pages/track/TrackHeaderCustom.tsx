import React from "react"
import { Track } from "../../../core/models/Track"

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
			<div className="bs-track-header">
				<BeatSaber.React.HeaderBackgroundImage
					imageUrl={artistImage}
					scrollBackdropOpacity={0}
					scrollOpacity={0}
				/>

				<BeatSaber.React.Card
					uri={track.uri.toString()}
					title={track.title}
					metadata={track.getArtist()}
					imageUrl={track.imageUri?.toImageURL()}
					trackUri="spotify:app:beatsaber"
					forceEnableOverlay={true}
					hideAddButton={true}
					hideMoreButton={true}
				/>
			</div>
		)
	}
}
