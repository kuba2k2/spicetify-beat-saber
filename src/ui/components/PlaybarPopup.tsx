import React from "react"
import styled from "styled-components"
import { Icon } from "./Icon"

type PlaybarPopupProps = {
	isOpen: boolean
	title: string
	titleIcon?: Spicetify.Model.Icon
	onTitleClick?: () => void
	onTitleIconClick?: () => void
	children: React.ReactNode[]
}

const Popup = styled.div<{ $visible: boolean }>`
	position: absolute;
	width: 280px;
	left: 0;
	bottom: 36px;
	transform: translateX(-50%);
	z-index: 1002;
	margin-left: 16px;

	background: var(--spice-card);
	color: var(--spice-text);
	font-size: 14px;
	box-shadow: 0 4px 12px 4px rgba(var(--spice-rgb-shadow), 0.5);
	border-radius: 8px;

	display: ${(props) => (props.$visible ? "block" : "none")};

	&:after {
		position: absolute;
		width: 0;
		height: 0;
		left: 50%;
		bottom: -20px;
		transform: translateX(-50%);
		content: "";
		border: 10px solid transparent;
		border-top-color: var(--spice-card);
	}
`

const Header = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	text-align: center;
	padding: 16px;

	h3 {
		color: var(--spice-text);
		flex-grow: 1;
		font-size: 18px;
		font-weight: 900;
		letter-spacing: -0.005em;
		line-height: 24px;
		margin: 0;
		outline: none;
		text-transform: none;
	}
`

const HeaderIcon = styled(BeatSaber.React.Button)`
	position: absolute;
	top: 18px;
	color: var(--spice-subtext);
	border-bottom: 0;
	right: 16px;

	&:focus,
	&:hover {
		color: var(--spice-text);
	}
`

const Content = styled.div`
	max-height: 400px;
	overflow-y: auto;
	border-radius: 0 0 8px 8px;
	padding: 0 20px 20px 20px;
`

export class PlaybarPopup extends React.Component<PlaybarPopupProps> {
	render() {
		return (
			<Popup $visible={this.props.isOpen}>
				<Header>
					<h3 onClick={this.props.onTitleClick}>
						{this.props.title}
					</h3>
					{this.props.titleIcon && (
						<Icon icon={this.props.titleIcon} />
					)}
				</Header>

				<Content>{this.props.children}</Content>
			</Popup>
		)
	}
}

type PlaybarPopupItemProps = {
	icon: Spicetify.Model.Icon
	title: string
	info?: any
	isActive?: boolean
	isDisabled?: boolean
	onClick?: () => void
}

const Item = styled.button<{ $isActive: boolean; $isDisabled: boolean }>`
	display: flex;
	align-items: center;
	width: 100%;
	height: 64px;
	outline: none;
	margin: 0;
	padding: 0;
	border: 0;
	background: none;
	color: ${(props) =>
		props.$isActive
			? "var(--spice-button)"
			: props.$isDisabled
			? "var(--spice-misc)"
			: "var(--spice-text)"};
	cursor: ${(props) => (props.$isDisabled ? "default" : "pointer")};

	&:hover {
		background-color: ${(props) =>
			props.$isDisabled ? "none" : "var(--spice-misc)"};
	}
`

const ItemIcon = styled.div<{ $isDisabled: boolean }>`
	margin: 0 20px;
	color: ${(props) =>
		props.$isDisabled ? "var(--spice-misc)" : "var(--spice-text)"};
`

const ItemBody = styled.div`
	flex: 1;
	min-width: 0;
	margin-right: 8px;
	text-align: left;
`

const ItemTitle = styled.p`
	font-size: 14px;
	font-weight: 900;
	letter-spacing: 0.015em;
	line-height: 20px;
	margin-bottom: 2px;
	overflow: hidden;
	text-overflow: ellipsis;
	text-transform: none;
	white-space: nowrap;
`

const ItemInfo = styled.p`
	color: var(--spice-subtext);
	font-size: 12px;
	font-weight: 300;
	margin-bottom: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

export class PlaybarPopupItem extends React.Component<PlaybarPopupItemProps> {
	render() {
		return (
			<li onClick={this.props.onClick}>
				<Item
					$isActive={this.props.isActive}
					$isDisabled={this.props.isDisabled}
				>
					<ItemIcon $isDisabled={this.props.isDisabled}>
						<Icon icon={this.props.icon} size={32} />
					</ItemIcon>
					<ItemBody>
						<ItemTitle>{this.props.title}</ItemTitle>
						{this.props.info && (
							<ItemInfo>{this.props.info}</ItemInfo>
						)}
					</ItemBody>
				</Item>
			</li>
		)
	}
}
