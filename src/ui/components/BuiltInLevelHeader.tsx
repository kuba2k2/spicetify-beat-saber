import { BuiltInLevel } from "../../core/models/BuiltInLevel";

type BuiltInLevelHeaderProps = {
	level: BuiltInLevel
}

export class BuiltInLevelHeader extends Spicetify.React.Component<BuiltInLevelHeaderProps> {

	render() {
		const level = this.props.level
		let source: string
		if (level.pack.isDLC) {
			source = `DLC level (${level.pack.name})`;
		} else if (level.pack.isOST) {
			source = level.pack.name;
		} else {
			source = `Built-in level (${level.pack.name})`;
		}

		return (
			<div className="bs-builtin-header">
				<HeaderData
					uri="spotify:app:beatsaber"
					title={level.songName}
					label={level.songAuthorName}
					metaInfo={
						<div>
							<span className="bs-builtin-subname">{level.songSubName}</span><br />
							<h3 className="bs-builtin-pack">{source}</h3>
						</div>
					}
					imageUrl={`${BeatSaber.AssetsUrl}/levels/${level.cover}.png`}
					backgroundType="image"
					backgroundImageUrl={`${BeatSaber.AssetsUrl}/levelpacks/${level.pack.cover}.png`}
					hideAddButton={true}
					hidePlayButton={true}
					scrollNode={document.createElement("div")} />
			</div>
		)
	}
}
