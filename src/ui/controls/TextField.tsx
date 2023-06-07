import React from "react"
import styled from "styled-components"
import { Button } from "./Button"

type TextFieldProps = {
	key?: string
	type?: string
	label?: string
	placeholder?: string
	value?: string
	iconStart?: IconType
	iconEnd?: IconType
	className?: string
	onChange?: (value: string) => void
	onSubmit?: (value: string) => void
	onIconStartClick?: () => void
	onIconEndClick?: () => void
}

const Label = styled.label`
	display: inline-block;
	margin-bottom: 5px;
	color: var(--spice-text);
	font-size: 14px;
`

const InputWrapper = styled.div`
	position: relative;
`

const StyledButton = styled.div`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
`

const StartButton = styled(StyledButton)`
	left: 4px;
`

const EndButton = styled(StyledButton)`
	right: 4px;
`

const Input = styled.input`
	width: 100%;
	height: 40px;
	padding: 0 12px;
	font-size: 14px;
	background: rgba(var(--spice-rgb-text), 0.2);
	color: var(--spice-text);
	border-radius: 4px !important;
	border: 1px solid transparent;

	${StartButton} ~ & {
		padding-left: 38px;
	}

	${EndButton} ~ & {
		padding-right: 38px;
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
			<div className={this.props.className}>
				{this.props.label && (
					<Label htmlFor={this.props.key}>{this.props.label}</Label>
				)}
				<InputWrapper>
					{this.props.iconStart && (
						<StartButton>
							<Button
								type="icon"
								icon={this.props.iconStart}
								onClick={this.props.onIconStartClick}
							/>
						</StartButton>
					)}

					{this.props.iconEnd && (
						<EndButton>
							<Button
								type="icon"
								icon={this.props.iconEnd}
								onClick={this.props.onIconEndClick}
							/>
						</EndButton>
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
			</div>
		)
	}
}
