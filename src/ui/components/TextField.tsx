import React from "react"
import styled from "styled-components"
import { Icon } from "./Icon"

type TextFieldProps = {
	key?: string
	type?: string
	label?: string
	placeholder?: string
	value?: string
	iconStart?: IconType
	iconEnd?: IconType
	onChange?: (value: string) => void
	onSubmit?: (value: string) => void
	onIconStartClick?: () => void
	onIconEndClick?: () => void
}

const Field = styled.div`
	margin-bottom: 15px;
`

const Label = styled.label`
	display: inline-block;
	margin-bottom: 5px;
	color: var(--spice-text);
	font-size: 14px;
`

const InputWrapper = styled.div`
	position: relative;
`

const StyledIcon = styled(Icon)<{ $clickable: boolean }>`
	display: block;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	padding: 10px;

	${(props) =>
		props.$clickable &&
		`
		&:hover {
			--bs-icon-color: var(--spice-text);
		}

		&:active {
			--bs-icon-color: rgba(var(--spice-rgb-text), 0.5);
		}
		`}
`

const StartIcon = styled(StyledIcon)`
	left: 0;
`

const EndIcon = styled(StyledIcon)`
	right: 0;
`

const Input = styled.input`
	width: 100%;
	height: 40px;
	padding: 0 12px;
	font-size: 14px;
	background: rgba(var(--spice-rgb-text), 0.1);
	color: var(--spice-text);
	border-radius: 4px !important;
	border: 1px solid transparent;

	${StartIcon} ~ & {
		padding-left: 36px;
	}

	${EndIcon} ~ & {
		padding-right: 36px;
	}
`

export class TextField extends React.PureComponent<TextFieldProps> {
	constructor(props: TextFieldProps) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
		this.handleKeyDown = this.handleKeyDown.bind(this)
	}

	handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (this.props.onChange) {
			this.props.onChange(event.target.value)
		}
	}

	handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter" && this.props.onSubmit) {
			event.preventDefault()
			this.props.onSubmit(this.props.value)
		}
	}

	render() {
		return (
			<Field>
				{this.props.label && (
					<Label htmlFor={this.props.key}>{this.props.label}</Label>
				)}
				<InputWrapper>
					{this.props.iconStart && (
						<StartIcon
							icon={this.props.iconStart}
							$clickable={
								!!this.props.onIconStartClick ||
								!!this.props.onIconEndClick
							}
						/>
					)}
					{this.props.iconEnd && (
						<EndIcon
							icon={this.props.iconEnd}
							$clickable={
								!!this.props.onIconStartClick ||
								!!this.props.onIconEndClick
							}
						/>
					)}
					<Input
						id={this.props.key}
						name={this.props.key}
						type={this.props.type ?? "text"}
						role="input"
						placeholder={this.props.placeholder}
						value={this.props.value}
						onChange={this.handleChange}
						onKeyDown={this.handleKeyDown}
					/>
				</InputWrapper>
			</Field>
		)
	}
}
