import React from "react"
import styled from "styled-components"
import { LoadingSpinner } from "../../components/LoadingSpinner"
import { Icon } from "../../controls/Icon"

type DirectoryPageProps = {
	initialPath: string
	pathRef: string[]
}

type DirectoryPageState = {
	loading: boolean
	path: string
	parent: string
	dirs: string[]
	files: string[]
}

const Page = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: scroll;
	height: 100%;
`

const Listing = styled.div`
	margin-left: 50px;
	margin-right: 50px;
`

const ItemIcon = styled(Icon)`
	margin-top: 2px;
`

const ItemIconHidden = styled(Icon)`
	margin-top: 2px;
	opacity: 0;
`

const ItemText = styled.p`
	margin: 0 0 5px 1.5em;
`

const ItemLink = styled.a`
	width: 100%;
	display: block;
`

export class DirectoryPage extends React.Component<
	DirectoryPageProps,
	DirectoryPageState
> {
	constructor(props: DirectoryPageProps) {
		super(props)
		this.state = {
			loading: true,
			path: props.initialPath,
			parent: "",
			dirs: [],
			files: [],
		}
	}

	static showAsModal(initialPath: string, onSuccess: (path: string) => void) {
		const path = [initialPath]
		BeatSaber.Core.renderModal(
			{
				title: "Browse for directory",
				className: "bs-modal",
				okLabel: "Save",
				cancelLabel: "Close",
				onOk: () => {
					onSuccess(path[0])
					return true
				},
			},
			<DirectoryPage initialPath={initialPath} pathRef={path} />
		)
	}

	componentDidMount() {
		this.navigate(this.state.path)
	}

	async navigate(path: string) {
		this.props.pathRef[0] = path
		this.setState({ loading: true })
		const data = await BeatSaber.Core.Api.listFilesInPath(path)
		this.setState(data)
		this.setState({ loading: false })
	}

	render() {
		let page: React.ReactNode

		if (this.state.loading) {
			page = <LoadingSpinner />
		} else {
			page = (
				<Listing>
					<h2>{this.state.path || "This Computer"}</h2>
					<ul>
						{this.state.path != this.state.parent && (
							<div>
								<ItemIcon icon="playlist-folder" />
								<ItemText>
									<ItemLink
										href="#"
										onClick={this.navigate.bind(
											this,
											this.state.parent
										)}
									>
										..
									</ItemLink>
								</ItemText>
							</div>
						)}
						{this.state.dirs.map((value) => (
							<div>
								<ItemIcon icon="playlist-folder" />
								<ItemText>
									<ItemLink
										href="#"
										onClick={this.navigate.bind(
											this,
											this.state.path + value
										)}
									>
										{value}
									</ItemLink>
								</ItemText>
							</div>
						))}
						{this.state.files.map((value) => (
							<div>
								<ItemIconHidden icon="playlist-folder" />
								<ItemText>{value}</ItemText>
							</div>
						))}
					</ul>
				</Listing>
			)
		}

		return <Page key={this.props.initialPath}>{page}</Page>
	}
}
