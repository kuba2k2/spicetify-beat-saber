import React from "react"
import styled from "styled-components"
import { Subscription } from "rxjs"
import { QueueState } from "../../core/queue/TrackQueue"
import { SettingsPopup } from "./popup/SettingsPopup"
import { Button } from "../controls/Button"
import {
	Notification,
	NotificationData,
	NotificationProps,
} from "../components/Notification"

type PopupAppState = {
	settingsOpen: boolean
	notification: NotificationData
	notificationVisible?: boolean
} & QueueState

const Wrapper = styled.div`
	position: relative;
`

export class PopupApp extends React.Component<unknown, PopupAppState> {
	queueSub: Subscription
	msgSub: Subscription
	msgTimeout: NodeJS.Timeout = null

	constructor() {
		super({})
		this.handleIconClick = this.handleIconClick.bind(this)
		this.state = {
			enqueued: [],
			blocked: false,
			settingsOpen: false,
			notification: {},
		}
	}

	componentDidMount() {
		this.queueSub = BeatSaber.Core.TrackQueue.queueSubject.subscribe(
			(state) => {
				this.setState(state)
			}
		)
		// subscribe to show notifications
		this.msgSub = BeatSaber.Core.NotificationSubject.subscribe((data) => {
			this.setState({ notification: data, notificationVisible: true })
			clearTimeout(this.msgTimeout)
			this.msgTimeout = setTimeout(() => {
				this.setState({ notificationVisible: false })
			}, 5000)
		})
	}

	componentWillUnmount() {
		this.queueSub.unsubscribe()
		this.msgSub.unsubscribe()
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

				<Notification
					isVisible={this.state.notificationVisible}
					{...this.state.notification}
				/>
			</Wrapper>
		)
	}
}
