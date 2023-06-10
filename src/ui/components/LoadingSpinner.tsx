import React from "react"
import styled, { keyframes } from "styled-components"

const Spinner = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	margin: 0;
	flex-grow: 1;
`

const loading = keyframes`
	7% {
		box-shadow: 0 -26px white,
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			0 26px 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			-26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2);
	}
	14% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.8),
			19.5px -19.5px 0 white, 26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			0 26px 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			-26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2);
	}
	21% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.6),
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.8), 26px 0 0 white,
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			0 26px 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			-26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2);
	}
	28% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.4),
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.6),
			26px 0 0 rgba(var(--spice-rgb-text), 0.8), 19.5px 19.5px 0 white,
			0 26px 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			-26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2);
	}
	35% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.2),
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.4),
			26px 0 0 rgba(var(--spice-rgb-text), 0.6),
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.8), 0 26px 0 white,
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			-26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2);
	}
	42% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.2),
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			26px 0 0 rgba(var(--spice-rgb-text), 0.4),
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.6),
			0 26px 0 rgba(var(--spice-rgb-text), 0.8), -19.5px 19.5px 0 white,
			-26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2);
	}
	49% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.2),
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.4),
			0 26px 0 rgba(var(--spice-rgb-text), 0.6),
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.8), -26px 0 0 white,
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2);
	}
	56% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.2),
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			0 26px 0 rgba(var(--spice-rgb-text), 0.4),
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.6),
			-26px 0 0 rgba(var(--spice-rgb-text), 0.8),
			-19.5px -19.5px 0 var(--modspotify_main_fg);
	}
	63% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.2),
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			0 26px 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.4),
			-26px 0 0 rgba(var(--spice-rgb-text), 0.6),
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.8);
	}
	70% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.2),
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			0 26px 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			-26px 0 0 rgba(var(--spice-rgb-text), 0.4),
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.6);
	}
	77% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.2),
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			0 26px 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			-26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.4);
	}
	84% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.2),
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			0 26px 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			-26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2);
	}
	100% {
		box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.2),
			19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			0 26px 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
			-26px 0 0 rgba(var(--spice-rgb-text), 0.2),
			-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2);
	}
`

const Animation = styled.div`
	width: 12px;
	height: 12px;
	position: absolute;
	top: 50%;
	left: 50%;
	margin: -6px 0 0 -6px;
	background: transparent;
	border-radius: 50%;

	box-shadow: 0 -26px rgba(var(--spice-rgb-text), 0.2),
		19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2),
		26px 0 0 rgba(var(--spice-rgb-text), 0.2),
		19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
		0 26px 0 rgba(var(--spice-rgb-text), 0.2),
		-19.5px 19.5px 0 rgba(var(--spice-rgb-text), 0.2),
		-26px 0 0 rgba(var(--spice-rgb-text), 0.2),
		-19.5px -19.5px 0 rgba(var(--spice-rgb-text), 0.2);
	animation: ${loading} 1.5s ease infinite;
`

export class LoadingSpinner extends React.Component {
	render() {
		return (
			<Spinner>
				<Animation />
			</Spinner>
		)
	}
}
