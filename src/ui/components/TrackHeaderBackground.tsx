import React from "react"
import styled, { css } from "styled-components"

type TrackHeaderBackgroundProps = {
	imageUrl: string
	overlay?: boolean
	gradient?: boolean
}

type TrackHeaderBackgroundState = {
	isLoaded: boolean
}

const Base = css`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	pointer-events: none;
	will-change: transform;
`

const Loader = styled.div<{ $loaded: boolean }>`
	${Base}
	opacity: ${(props) => (props.$loaded ? 1 : 0)};
	transform: scale(${(props) => (props.$loaded ? 1 : 0.95)});
	transition: opacity 0.9s cubic-bezier(0.3, 0, 0, 1),
		transform 0.9s cubic-bezier(0.3, 0, 0, 1);
`

const BackgroundImage = styled.div`
	${Base}
	contain: paint layout;
	background-size: cover;
	background-position: 50%;
`

const Overlay = styled.div`
	${Base}
	background: rgba(24, 24, 24, 0.44);
`

const Gradient = styled.div`
	${Base}
	top: 30%;
	background: linear-gradient(180deg, transparent, var(--gradient-bg));
`

export class TrackHeaderBackground extends React.Component<
	TrackHeaderBackgroundProps,
	TrackHeaderBackgroundState
> {
	constructor(props: TrackHeaderBackgroundProps) {
		super(props)
		this.state = {
			isLoaded: false,
		}
	}

	componentDidMount() {
		this.loadImage(this.props.imageUrl)
	}

	componentDidUpdate(prevProps: TrackHeaderBackgroundProps) {
		prevProps.imageUrl !== this.props.imageUrl &&
			this.loadImage(this.props.imageUrl)
	}

	loadImage(imageUrl: string) {
		this.setState({ isLoaded: false })
		const image = new Image()
		image.onload = () => {
			this.props.imageUrl === imageUrl &&
				this.setState({ isLoaded: true })
		}
		image.src = imageUrl
	}

	render() {
		const style = this.props.imageUrl
			? {
					backgroundImage: `url(${this.props.imageUrl})`,
			  }
			: {}

		return (
			<div>
				<Loader $loaded={this.state.isLoaded}>
					<BackgroundImage style={style} />
				</Loader>
				{this.props.overlay && <Overlay />}
				{this.props.gradient && <Gradient />}
			</div>
		)
	}
}
