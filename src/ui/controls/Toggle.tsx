import React from "react"
import styled from "styled-components"

type ToggleProps = {
	isActive?: boolean
	isDisabled?: boolean
	className?: string
	labelId?: string
	onChange?: (isActive: boolean) => boolean
}

const ToggleOuter = styled.div`
	display: inline-block;
`

const ToggleInput = styled.input`
	display: none;
`

const ToggleIndicator = styled.div`
	width: 42px;
	height: 24px;
	position: relative;
	transition: all 0.4s ease;
	background: var(--spice-button-disabled);
	border-radius: 24px;
	display: inline-block;

	&:focus {
		outline: 0;
	}

	${ToggleInput}:checked ~ & {
		background: var(--spice-button);

		&:hover {
			background: var(--spice-button-active);
		}
	}

	${ToggleInput}:disabled ~ & {
		border-color: transparent;
		opacity: 0.4;
		pointer-events: none;
		cursor: not-allowed;
	}
`

const ToggleInner = styled.div`
	width: 20px;
	height: 20px;
	position: absolute;
	top: 2px;
	left: 2px;
	transition: all 0.4s ease;
	background: var(--spice-subtext);
	border-radius: inherit;
	box-shadow: 0 0 1px rgba(var(--spice-rgb-shadow), 0.75),
		0 0 3px rgba(var(--spice-rgb-shadow), 0.3);

	${ToggleIndicator}:hover & {
		background: var(--spice-text);
	}

	${ToggleInput}:enabled ~ ${ToggleIndicator}:active & {
		width: 22px;
	}

	${ToggleInput}:checked ~ ${ToggleIndicator} & {
		background: var(--spice-text);
		left: 20px;
	}

	${ToggleInput}:disabled ~ ${ToggleIndicator} & {
		box-shadow: none;
	}
`

export class Toggle extends React.PureComponent<ToggleProps> {
	constructor(props: ToggleProps) {
		super(props)
	}

	handleChange() {
		if (!this.props.isDisabled) this.props.onChange(!this.props.isActive)
	}

	render() {
		return (
			<ToggleOuter className={this.props.className}>
				<ToggleInput
					type="checkbox"
					name={this.props.labelId}
					id={this.props.labelId}
					checked={this.props.isActive}
					disabled={this.props.isDisabled}
				/>
				<ToggleIndicator onClick={this.handleChange.bind(this)}>
					<ToggleInner />
				</ToggleIndicator>
			</ToggleOuter>
		)
	}
}
