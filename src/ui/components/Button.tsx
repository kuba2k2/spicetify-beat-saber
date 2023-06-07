import React from "react"
import { CSSProperties } from "react"
import styled, { css } from "styled-components"
import { Icon } from "./Icon"

type ButtonColor =
	| "primary"
	| "green"
	| "blue"
	| "red"
	| "white"
	| "gray"
	| "transparent"
type ButtonSize = 16 | 24 | 28 | 32 | 48 | 56

type ButtonProps = {
	type?: "normal" | "icon"
	icon?: IconType
	text?: String
	tooltip?: string
	color?: ButtonColor
	outline?: boolean
	size?: ButtonSize
	isDisabled?: boolean
	className?: string
	onClick?: () => void
}

const buttonScale: { [key in ButtonSize]: number } = {
	16: 1.125,
	24: 1.0833333333,
	28: 1.0714285714,
	32: 1.0625,
	48: 1.0833333333,
	56: 1.0714285714,
}

type ButtonColorDef = {
	color: CSSProperties["color"]
	hover: CSSProperties["color"]
	text: CSSProperties["color"]
}

const buttonColor: { [key in ButtonColor]: ButtonColorDef } = {
	primary: {
		color: "var(--spice-button)",
		hover: "var(--spice-button-active)",
		text: "var(--spice-text)",
	},
	green: {
		color: "#1db954",
		hover: "#1cd85e",
		text: "#ffffff",
	},
	blue: {
		color: "#2e77d0",
		hover: "#2c83ec",
		text: "#ffffff",
	},
	red: {
		color: "#cd1a2b",
		hover: "#eb182c",
		text: "#ffffff",
	},
	white: {
		color: "#ffffff",
		hover: "#ffffff",
		text: "#000000",
	},
	gray: {
		color: "#404040",
		hover: "#535353",
		text: "#ffffff",
	},
	transparent: {
		color: "transparent",
		hover: "transparent",
		text: "var(--spice-text)",
	},
}

type StyledProps = {
	$clickable: boolean
	$outlined: boolean
	$iconSecondary: boolean
	$iconAndText: boolean
	$size: number
	$color: ButtonColorDef
}

const ButtonOutline = css`
	&:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		border-radius: 500px;
		box-shadow: inset 0 0 0 1px #b3b3b3;
	}

	&:enabled:hover {
		box-shadow: inset 0 0 0 1px #fff, 0 0 0 1px transparent;

		&:after {
			box-shadow: inset 0 0 0 1px #fff;
		}
	}

	&:enabled:active {
		box-shadow: inset 0 0 0 1px #8f8f8f;

		&:after {
			box-shadow: inset 0 0 0 1px #8f8f8f;
		}
	}
`

const ButtonHover = css<StyledProps>`
	&:enabled:hover {
		background: ${(props) => props.$color.hover};
		transform: scale(${(props) => buttonScale[props.$size]});
		transition: none 33ms cubic-bezier(0.3, 0, 0, 1);
		transition-property: transform, box-shadow, color, background-color;
	}

	&:enabled:hover:active {
		opacity: 0.8;
		transform: scale(0.99);
	}
`

const ButtonIcon = styled(Icon)``

const ButtonBase = styled.button<StyledProps>`
	--bs-button-size: ${(props) => `${props.$size}px`};
	--bs-icon-color: ${(props) => props.$color.text};

	position: relative;
	user-select: none;
	height: var(--bs-button-size);
	max-width: 100%;
	border-radius: 500px;
	border: 0;
	padding: 0;
	cursor: default;
	box-shadow: 0 0 0 20px transparent;
	outline: none;
	white-space: nowrap;
	transition: none 33ms cubic-bezier(0.3, 0, 0.7, 1);
	transition-property: transform, box-shadow, color, background-color;
	background: ${(props) => props.$color.color};
	color: ${(props) => props.$color.text};

	&:disabled {
		pointer-events: none;
		opacity: 0.4;
	}

	${(props) => props.$clickable && ButtonHover}
	${(props) => props.$outlined && ButtonOutline}
`

const Text = styled.span`
	display: inline;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	opacity: 1;
	vertical-align: super;
`

const Small = styled(Text)`
	color: var(--spice-subtext);
	font-size: 80%;
	vertical-align: middle;
	padding: 0 4px;

	:hover > & {
		color: var(--spice-text);
	}
`

const NormalButton = styled(ButtonBase)<StyledProps>`
	font-size: 11px;
	line-height: var(--bs-button-size);
	letter-spacing: 0.16em;
	font-weight: 700;
	text-transform: uppercase;
	padding: 0
		calc(var(--bs-button-size) / ${(props) => (props.$iconAndText ? 2 : 1)});
	transition: none 33ms cubic-bezier(0.3, 0, 0.7, 1);
	transition-property: transform, box-shadow, color, background-color;

	${ButtonIcon} + ${Text} {
		margin-left: 10px;
	}

	${(props) =>
		props.$iconAndText &&
		css`
			${ButtonIcon} {
				position: relative;
				top: 50%;
				transform: translateY(-50%);
			}
		`}
`

const IconButton = styled(ButtonBase)<StyledProps>`
	--bs-icon-color: ${(props) =>
		props.$iconSecondary ? "var(--spice-subtext)" : props.$color.text};

	${(props) =>
		props.$iconAndText
			? css`
					${ButtonIcon} {
						transform: translateY(25%);
					}
			  `
			: css`
					width: var(--bs-button-size);

					${ButtonIcon} {
						width: var(--bs-button-size);
					}
			  `}

	${(props) =>
		props.$clickable &&
		css<StyledProps>`
			&:enabled:hover {
				--bs-icon-color: ${(props) =>
					props.$iconSecondary
						? "var(--spice-text)"
						: props.$color.text};

				${(props) => props.$iconAndText && `transform: none;`}
				&:active {
					${(props) => props.$iconAndText && `transform: none;`}
				}
			}
		`}
`

export class Button extends React.PureComponent<ButtonProps> {
	render() {
		const type = this.props.type ?? "normal"
		const size = this.props.size ?? 32
		const color = this.props.outline
			? "transparent"
			: this.props.color ?? (type == "normal" ? "primary" : "transparent")

		const Component = type == "normal" ? NormalButton : IconButton
		return (
			<Component
				className={this.props.className}
				disabled={this.props.isDisabled}
				onClick={this.props.onClick}
				$clickable={
					!!this.props.onClick ||
					type != "icon" ||
					color != "transparent" ||
					this.props.outline
				}
				$outlined={this.props.outline}
				$iconSecondary={this.props.outline || color == "transparent"}
				$iconAndText={this.props.icon && this.props.text}
				$size={size}
				$color={buttonColor[color]}
			>
				{this.props.icon && (
					<ButtonIcon icon={this.props.icon} size={16} />
				)}
				{this.props.text &&
					(type == "normal" ? (
						<Text>{this.props.text}</Text>
					) : (
						<Small>{this.props.text}</Small>
					))}
			</Component>
		)
	}
}
