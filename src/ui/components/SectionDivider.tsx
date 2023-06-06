import React from "react"
import styled from "styled-components"

type SectionDividerProps = {
	children?: React.ReactNode[]
	description?: string
	title?: React.ReactNode
}

const DividerOuter = styled.div`
	padding: 16px 0 10px;
`

const DividerContainer = styled.div`
	align-items: flex-end;
	border-bottom: 1px solid var(--spice-misc);
	display: flex;
	justify-content: space-between;
	padding-bottom: 4px;
`

const DividerTitle = styled.div`
	color: var(--spice-text);
	font-size: 18px;
	font-weight: 900;
	letter-spacing: -0.005em;
	line-height: 24px;
	margin: 0;
	text-transform: none;
`

const DividerDescription = styled.p`
	color: var(--spice-subtext);
	font-size: 14px;
	font-weight: 400;
	letter-spacing: 0.015em;
	line-height: 20px;
	margin: 0;
	text-transform: none;
`

const DividerAuxiliary = styled.div`
	flex-shrink: 0;
`

export class SectionDivider extends React.PureComponent<SectionDividerProps> {
	constructor(props: SectionDividerProps) {
		super(props)
	}

	render() {
		return (
			<DividerOuter>
				<DividerContainer>
					<div>
						{this.props.title && (
							<DividerTitle>{this.props.title}</DividerTitle>
						)}
						{this.props.description && (
							<DividerDescription>
								{this.props.description}
							</DividerDescription>
						)}
					</div>
					{this.props.children && (
						<DividerAuxiliary>
							{this.props.children}
						</DividerAuxiliary>
					)}
				</DividerContainer>
			</DividerOuter>
		)
	}
}
