import React, { MouseEvent } from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"
import { Button } from "../controls/Button"

type XpuiModalParams = {
	modal: HTMLElement
} & Spicetify.ModalParams

type XpuiModalState = {
	isOpen: boolean
}

const Container = styled.div`
	width: 1000px;
`

const Header = styled.div`
	position: relative;
	padding: 8px 24px;
`

const CloseButton = styled(Button)``

const Content = styled.div`
	max-height: 600px;
	min-height: 500px;
	overflow: auto;
	display: flex;
	flex-direction: column;
`

const Footer = styled.div`
	padding: 16px 16px 8px;
	text-align: center;

	button + button {
		margin-left: 16px;
	}
`

export class XpuiModal extends React.Component<
	XpuiModalParams,
	XpuiModalState
> {
	mainRef: React.Ref<HTMLDivElement>

	constructor(props: XpuiModalParams) {
		super(props)
		this.close = this.close.bind(this)
		this.handleScrimClick = this.handleScrimClick.bind(this)
		this.mainRef = React.createRef()
		this.state = { isOpen: false }
	}

	static open(parent: HTMLElement, options: Spicetify.ModalParams) {
		const modal = parent.ownerDocument.createElement("div")
		modal.className = "ReactModalPortal bs-modal"
		BeatSaber.Core.render(<XpuiModal modal={modal} {...options} />, modal)
		parent.appendChild(modal)
	}

	close() {
		this.setState({ isOpen: false })
		setTimeout(() => {
			ReactDOM.unmountComponentAtNode(this.props.modal)
			this.props.modal.remove()
		}, 500)
	}

	handleScrimClick(event: MouseEvent) {
		if (
			this.props.isCancelable &&
			// @ts-ignore
			!this.mainRef.current.contains(event.target)
		) {
			this.close()
		}
	}

	componentDidMount() {
		this.props.onShow && this.props.onShow()
		setTimeout(() => {
			this.setState({ isOpen: true })
		}, 100)
	}

	componentWillUnmount() {
		this.props.onHide && this.props.onHide()
	}

	render() {
		return (
			<div
				className={`GenericModal__overlay GenericModal__overlay--animated ${
					this.state.isOpen ? "GenericModal__overlay--afterOpen" : ""
				}`}
				style={{ zIndex: 100 }}
				onClick={this.handleScrimClick}
			>
				<div
					ref={this.mainRef}
					className="GenericModal encore-dark-theme"
				>
					<Container className="main-playlistEditDetailsModal-container">
						<Header className="main-playlistEditDetailsModal-header">
							<h2>{this.props.title}</h2>
							<CloseButton
								className="main-playlistEditDetailsModal-closeBtn"
								type="icon"
								icon="x"
								onClick={this.close}
							/>
						</Header>

						<Content>{this.props.children}</Content>

						{(this.props.okLabel || this.props.cancelLabel) && (
							<Footer>
								{this.props.okLabel && (
									<Button
										text={this.props.okLabel}
										onClick={this.props.onOk || this.close}
									/>
								)}
								{this.props.cancelLabel && (
									<Button
										text={this.props.cancelLabel}
										onClick={
											this.props.onCancel || this.close
										}
									/>
								)}
							</Footer>
						)}
					</Container>
				</div>
			</div>
		)
	}
}
