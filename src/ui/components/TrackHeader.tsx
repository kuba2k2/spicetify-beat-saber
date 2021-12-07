import { Track } from "../../core/models/Track";

type TrackHeaderProps = {
	track: Track
}

export class TrackHeader extends Spicetify.React.Component<TrackHeaderProps> {

	render() {
		const track = this.props.track
		let artistImage: string
		if (track.artistImage) {
			artistImage = track.artistImage.toImageURL()
		}
		return (
			<div className="bs-track-header">

				<HeaderBackgroundImage
					imageUrl={artistImage}
					scrollBackdropOpacity={0}
					scrollOpacity={0} />

				<Card
					uri={track.uri.toString()}
					title={track.title}
					metadata={track.getArtist()}
					imageUrl={track.imageUri?.toImageURL()}
					trackUri="spotify:app:beatsaber"
					forceEnableOverlay={true}
					hideAddButton={true}
					hideMoreButton={true} />
			</div>
		)
	}
}
