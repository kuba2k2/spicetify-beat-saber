type ButtonGroupProps = {
	children: [string, Spicetify.Model.Icon][]
	selectedIndex?: number
	onChange?: (index: number) => void
}

export class ButtonGroup extends Spicetify.React.Component<ButtonGroupProps> {

	constructor(props: ButtonGroupProps) {
		super(props)
	}

	handleClick(index: number) {
		if (this.props.onChange)
			this.props.onChange(index)
	}

	render() {
		return (
			<div className="bs-button-group">
				{this.props.children.map(([text, icon], index) => (
					<Button
						type={index == this.props.selectedIndex ? "green" : "stroke"}
						icon={icon}
						text=""
						tooltip={text}
						onClick={this.handleClick.bind(this, index)} />
				))}
			</div>
		)
	}
}
