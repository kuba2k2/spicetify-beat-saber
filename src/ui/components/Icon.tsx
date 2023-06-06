import React from "react"

type IconProps = {
	icon: Spicetify.Model.Icon | BeatSaberIcon
	size?: 16 | 24 | 32
	isActive?: boolean
	isDisabled?: boolean
}

export class Icon extends React.PureComponent<IconProps> {
	render() {
		const size = this.props.size ?? 16
		if (BeatSaber.IsZlink) {
			return <i className={`spoticon-${this.props.icon}-${size}`}></i>
		}
		if (BeatSaber.IsXpui) {
			return (
				<svg
					role="presentation"
					width={size}
					height={size}
					viewBox={`0 0 ${size} ${size}`}
				>
					{
						// @ts-ignore
						Spicetify.SVGIcons[this.props.icon]
					}
				</svg>
			)
		}
	}
}
