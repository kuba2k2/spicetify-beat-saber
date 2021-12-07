type EmptyViewProps = {
	query: string
	hint?: string
}

export class EmptyView extends Spicetify.React.Component<EmptyViewProps> {

	render() {
		return (
			<div className="bs-empty-view">
				<span className="spoticon-flag-64"></span>
				<h3>No results found for "{this.props.query}"</h3>
				<p>{this.props.hint ?? "Please make sure your words are spelled correctly or use less or different keywords."}</p>
			</div>
		)
	}
}
