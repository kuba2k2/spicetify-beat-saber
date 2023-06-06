import React from "react"
import styled from "styled-components"

type IconProps = {
	icon: Spicetify.Model.Icon | BeatSaberIcon
	size?: 16 | 24 | 32
	isActive?: boolean
	isDisabled?: boolean
	className?: string
}

const IconZlink = styled.i`
	color: var(--bs-icon-color);
`

const IconXpui = styled.svg`
	fill: var(--bs-icon-color);
`

export class Icon extends React.PureComponent<IconProps> {
	render() {
		const size = this.props.size ?? 16
		if (BeatSaber.IsZlink) {
			return (
				<IconZlink
					className={`spoticon-${this.props.icon}-${size} ${this.props.className}`}
				/>
			)
		}
		if (BeatSaber.IsXpui) {
			return (
				<div className={this.props.className}>
					<div style={{ width: `${size}px`, height: `${size}px` }}>
						<IconXpui
							role="presentation"
							width={size}
							height={size}
							viewBox={`0 0 ${size} ${size}`}
							dangerouslySetInnerHTML={{
								// @ts-ignore
								__html: Spicetify.SVGIcons[this.props.icon],
							}}
						/>
					</div>
				</div>
			)
		}
	}
}
