import React from "react"
import styled from "styled-components"
import { Subscription } from "rxjs"
import { QueueState } from "../../core/queue/TrackQueue"
import { SettingsPopup } from "./popup/SettingsPopup"
import { Button } from "../controls/Button"

type PopupAppState = {
	settingsOpen: boolean
} & QueueState

const Wrapper = styled.div`
	position: relative;
`

export class PopupApp extends React.Component<unknown, PopupAppState> {
	subscription: Subscription

	constructor() {
		super({})
		this.handleIconClick = this.handleIconClick.bind(this)
		this.state = {
			enqueued: [],
			blocked: false,
			settingsOpen: false,
		}
	}

	componentDidMount() {
		this.subscription = BeatSaber.Core.TrackQueue.queueSubject.subscribe(
			(state) => {
				this.setState(state)
			}
		)
	}

	componentWillUnmount() {
		this.subscription.unsubscribe()
	}

	handleIconClick() {
		this.setState({
			settingsOpen: !this.state.settingsOpen,
		})
	}

	render() {
		let requests = this.state.enqueued
		if (this.state.current) {
			requests = [this.state.current].concat(this.state.enqueued)
		}

		return (
			<Wrapper>
				<Button
					type="icon"
					icon="bs-note"
					text={requests.length.toString()}
					tooltip="Beat Saber"
					activeColor="red"
					isActive={this.state.blocked}
					onClick={this.handleIconClick}
				/>

				<SettingsPopup
					isOpen={this.state.settingsOpen}
					{...this.state}
				/>
			</Wrapper>
		)
	}
}
