import React from "react"
import styled from "styled-components"
import { Button } from "../controls/Button"
import { TrackHeaderBackground } from "./TrackHeaderBackground"

type TrackHeaderProps = {
	title?: string
	label?: string
	imageUrl?: string
	backgroundImageUrl?: string
	buttons?: Button[]
}

const Header = styled.header`
	position: relative;
	min-height: 300px;
	display: flex;
`

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	min-height: 208px;
	max-width: 1480px;
	padding: 72px 32px 16px 32px;
	contain: paint;
`

const Content = styled.div`
	display: flex;
	flex: 1;
	overflow: visible;
	margin-top: -10px;
	margin-bottom: -10px;
	padding-top: 10px;
	padding-bottom: 10px;
	margin-left: -10px;
	padding-left: 10px;
`

const ImageOuter = styled.div`
	width: 220px;
	flex: 0 0 auto;
	margin-right: 24px;
`

const ImageWrapper = styled.div`
	position: relative;
	height: 100%;
	padding-bottom: 100%;
	border-radius: 10px;
	overflow: hidden;
`

const Image = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	background-position: 50%;
	background-repeat: no-repeat;
	background-size: contain;
	border-radius: 10px;
	overflow: hidden;
`

const Data = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: flex-end;
	overflow: visible !important;
	margin-left: -10px;
	margin-bottom: -10px;
	padding-left: 10px;
	padding-bottom: 10px;
`

const Label = styled.span`
	height: 22px;
	padding-top: 6px;
	color: #fff;
	font-size: 11px;
	font-weight: 400;
	line-height: 16px;
	letter-spacing: 0.16em;
	text-transform: uppercase;
`

const Title = styled.span`
	margin: 0;
	margin-left: -0.07em;
	color: #fff;
	font-size: 48px;
	font-weight: 900;
	line-height: 56px;
	letter-spacing: -0.005em;
	text-transform: none;
	overflow-wrap: break-word;
`

const Info = styled.div`
	margin-top: 10px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

const Buttons = styled.div`
	display: flex;

	& > * {
		margin-top: 20px;
		margin-right: 12px;
	}
`

export class TrackHeader extends React.PureComponent<TrackHeaderProps> {
	render() {
		return (
			<Header>
				<TrackHeaderBackground
					imageUrl={this.props.backgroundImageUrl}
					gradient={true}
				/>
				<ContentWrapper>
					<Content>
						{this.props.imageUrl && (
							<ImageOuter>
								<ImageWrapper>
									<Image
										style={{
											backgroundImage: `url(${this.props.imageUrl})`,
										}}
									/>
								</ImageWrapper>
							</ImageOuter>
						)}
						<Data>
							{this.props.label && (
								<Label>{this.props.label}</Label>
							)}
							{this.props.title && (
								<Title>{this.props.title}</Title>
							)}
							{this.props.children && (
								<Info>{this.props.children}</Info>
							)}
							{this.props.buttons && (
								<Buttons>{...this.props.buttons}</Buttons>
							)}
						</Data>
					</Content>
				</ContentWrapper>
			</Header>
		)
	}
}
