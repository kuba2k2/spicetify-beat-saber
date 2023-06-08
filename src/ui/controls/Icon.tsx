import React from "react"
import styled from "styled-components"

type IconProps = {
	icon: IconType
	size?: 16 | 24 | 32
	className?: string
}

const IconOuter = styled.div<{ $size: number }>`
	width: ${(props) => `${props.$size}px`};
	height: ${(props) => `${props.$size}px`};
	line-height: 0;
	float: left;
`

const IconZlink = styled.i<{ $size: number }>`
	color: var(--bs-icon-color);
	line-height: ${(props) => `${props.$size}px`};

	&::before {
		font-size: ${(props) => `${props.$size}px`};
	}
`

const IconXpui = styled.svg`
	fill: var(--bs-icon-color);
`

export class Icon extends React.PureComponent<IconProps> {
	render() {
		const icon = this.props.icon
		const size = this.props.size ?? 16

		const bsIcon = icon.startsWith("bs-") && icon.substring(3)
		const zlinkIcon = !bsIcon && BeatSaber.IsZlink
		const xpuiIcon = !bsIcon && BeatSaber.IsXpui

		return (
			<IconOuter $size={size} className={this.props.className}>
				{bsIcon && (
					<IconZlink className={`bs-icon-${bsIcon}`} $size={size} />
				)}

				{zlinkIcon && (
					<IconZlink
						className={`spoticon-${icon}-${size}`}
						$size={size}
					/>
				)}

				{xpuiIcon && (
					<IconXpui
						role="presentation"
						width={size}
						height={size}
						viewBox={`0 0 16 16`}
						dangerouslySetInnerHTML={{
							// @ts-ignore
							__html: Spicetify.SVGIcons[icon],
						}}
					/>
				)}
			</IconOuter>
		)
	}
}
