import React from "react"
import styled from "styled-components"
import { Button } from "./Button"

type ButtonGroupProps = {
	children: [string, IconType][]
	selectedIndex?: number
	className?: string
	onChange?: (index: number) => void
}

const GroupButton = styled(Button)<{ $selected: boolean }>`
	border-radius: 0;
	height: 20px;
	line-height: 18px;
	margin-bottom: 5px;
	margin-top: -5px;
	padding-left: 16px;
	padding-right: 16px;
	z-index: ${(props) => (props.$selected ? 2 : 1)};

	&:hover {
		z-index: 3;
	}

	&::after {
		border-radius: 0;
	}

	&:first-child {
		padding-left: 20px;
		margin-right: -2px;

		&,
		&::after {
			border-top-left-radius: 16px;
			border-bottom-left-radius: 16px;
		}
	}

	&:last-child {
		margin-left: -2px;

		&,
		&::after {
			border-top-right-radius: 16px;
			border-bottom-right-radius: 16px;
		}
	}

	i::before {
		font-size: 12px;
	}

	svg {
		display: inline-block;
		width: 12px;
	}
`

export class ButtonGroup extends React.Component<ButtonGroupProps> {
	constructor(props: ButtonGroupProps) {
		super(props)
	}

	handleClick(index: number) {
		if (this.props.onChange) this.props.onChange(index)
	}

	render() {
		return (
			<div className={this.props.className}>
				{this.props.children.map(([text, icon], index) => (
					<GroupButton
						icon={icon}
						outline={index != this.props.selectedIndex}
						tooltip={text}
						onClick={this.handleClick.bind(this, index)}
						$selected={index == this.props.selectedIndex}
					/>
				))}
			</div>
		)
	}
}
