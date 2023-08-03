import React from "react"
import styled from "styled-components"

const Outer = styled.div<{ $color: string; $isVisible: boolean }>`
	position: fixed;
	bottom: 100px;
	left: 50%;
	transform: translate(-50%, 0);
	z-index: 100000000;

	border-radius: 8px;
	box-shadow: 0 4px 12px 4px rgba(0, 0, 0, 0.5);
	color: #fff;
	display: inline-block;
	font-size: 16px;
	line-height: 20px;
	max-width: 450px;
	opacity: 1;
	padding: 12px 36px;
	text-align: center;
	transition: none 0.5s cubic-bezier(0.3, 0, 0.4, 1);
	transition-property: opacity, background-color;

	background-color: ${(props) => props.$color};
	opacity: ${(props) => (props.$isVisible ? 1.0 : 0.0)};
	pointer-events: ${(props) => (props.$isVisible ? "initial" : "none")};
`

export type NotificationType = "success" | "info" | "error"

export type NotificationData = {
	type?: NotificationType
	text?: string
}

export type NotificationProps = {
	isVisible?: boolean
} & NotificationData

const colors = {
	success: "#1CB552",
	info: "#2E77D0",
	error: "#CD1A2B",
}

export class Notification extends React.Component<NotificationProps> {
	render() {
		return (
			<Outer
				$color={colors[this.props.type]}
				$isVisible={this.props.isVisible}
			>
				{this.props.text}
			</Outer>
		)
	}
}
