export type Difficulty = "easy" | "normal" | "hard" | "expert" | "expertplus"
export type Characteristic =
	| "standard"
	| "onesaber"
	| "90degree"
	| "360degree"
	| "lightshow"
	| "lawless"
	| "noarrows"

type DifficultyBadgeProps = {
	characteristic: Characteristic
	difficulty: Difficulty
	tooltip?: string
}

const diffNames = {
	easy: "Easy",
	normal: "Normal",
	hard: "Hard",
	expert: "Expert",
	expertplus: "Expert+",
}

export class DifficultyBadge extends Spicetify.React
	.Component<DifficultyBadgeProps> {
	render() {
		return (
			<span
				className={[
					"bs-badge",
					`bs-icon-${this.props.characteristic}`,
					`bs-${this.props.difficulty}`,
				].join(" ")}
				data-tooltip={this.props.tooltip}
			>
				{diffNames[this.props.difficulty]}
			</span>
		)
	}
}
