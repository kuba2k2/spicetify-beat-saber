import React from "react"
import { TextField } from "./TextField"

type SearchFieldProps = {
	placeholder?: string
	value?: string
	className?: string
	onSearch: (query: string) => void
	onSubmit?: () => void
}

export class SearchField extends React.Component<SearchFieldProps> {
	constructor(props: SearchFieldProps) {
		super(props)
		this.handleClear = this.handleClear.bind(this)
	}

	handleClear() {
		this.props.onSearch("")
	}

	render() {
		return (
			<TextField
				className={this.props.className}
				key="search"
				placeholder={this.props.placeholder}
				value={this.props.value}
				iconStart="search"
				iconEnd="x"
				onChange={this.props.onSearch}
				onSubmit={this.props.onSubmit}
				onIconEndClick={this.handleClear}
			/>
		)
	}
}
