import React from "react"
import { Subscription } from "rxjs"
import { QueueState } from "../../core/queue/TrackQueue"
import { Button } from "../controls/Button"

export class QueueStateDemo extends React.Component<unknown, QueueState> {
	subscription: Subscription

	constructor() {
		super({})
		this.state = {
			enqueued: [],
			blocked: false,
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

	render() {
		return (
			<div style={{ margin: "0 20px" }}>
				<h2>TrackQueue</h2>
				<Button
					color="blue"
					text="Unlock"
					isDisabled={!this.state.blocked}
					onClick={BeatSaber.Core.TrackQueue.queueUnblock}
				/>
				<br />
				<br />
				{this.state.enqueued.map((request) => (
					<span style={{ marginTop: "5px" }}>
						<b>
							<i>{request.type}</i>
						</b>{" "}
						-<code>{request.slug}</code>
						<br />
					</span>
				))}
			</div>
		)
	}
}
