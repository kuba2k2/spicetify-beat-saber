import React from "react"
import styled from "styled-components"
import { Icon } from "../controls/Icon"

type EmptyViewProps = {
	query: string
	hint?: string
}

const Container = styled.div`
	flex-grow: 1;
	align-self: center;

	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;

	padding-top: 32px;
	padding-bottom: 16px;
`

const CenteredIcon = styled(Icon)`
	margin: 0 auto;
`

const Title = styled.h3`
	font-size: 28px;
	line-height: 36px;
	letter-spacing: -0.005em;
	font-weight: 900;
	color: #fff;
	text-transform: none;
	margin-block-start: 1em;
	margin-block-end: 1em;
`

const Text = styled.p`
	max-width: 400px;
`

export class EmptyView extends React.Component<EmptyViewProps> {
	render() {
		return (
			<Container>
				<CenteredIcon icon="search" size={48} />
				<Title>No results found for "{this.props.query}"</Title>
				<Text>
					{this.props.hint ??
						"Please make sure your words are spelled correctly or use less or different keywords."}
				</Text>
			</Container>
		)
	}
}
