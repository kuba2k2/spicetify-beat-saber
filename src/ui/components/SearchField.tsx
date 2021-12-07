type SearchFieldProps = {
	placeholder?: string
	value?: string
	onSearch: (query: string) => void
	onSubmit?: () => void
}

export class SearchField extends Spicetify.React.Component<SearchFieldProps> {
	constructor(props: SearchFieldProps) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
		this.handleClear = this.handleClear.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
	}

	handleChange(event: Spicetify.React.ChangeEvent<HTMLInputElement>) {
		this.props.onSearch(event.target.value)
	}

	handleClear() {
		this.props.onSearch("")
	}

	handleKeyPress(event: Spicetify.React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter" && this.props.onSubmit) {
			event.preventDefault()
			this.props.onSubmit()
		}
	}

	render() {
		return (
			<div className="h-search-field-outer-wrapper bs-search-field">
				<div className="h-search-field-wrapper">
					<div className={`${this.props.value ? "focus" : ""} h-search-wrapper spoticon-search-16`}>

						<input
							className="h-search"
							type="text"
							role="input"
							placeholder={this.props.placeholder}
							value={this.props.value}
							onChange={this.handleChange}
							onKeyDown={this.handleKeyPress} />

						<span
							className="h-search-close spoticon-x-16"
							onClick={this.handleClear} />

						<ul className="h-search-suggestions" />

					</div>
				</div>
			</div>
		)
	}
}
