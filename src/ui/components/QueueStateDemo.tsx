import { Subscription } from "rxjs"
import { QueueRequest } from "../../core/queue/requests/QueueRequest"
import { QueueState } from "../../core/queue/TrackQueue"

export class QueueStateDemo extends Spicetify.React.Component<unknown, QueueState> {
	subscription: Subscription

	constructor() {
		super({})
		this.state = {
			enqueued: [],
			blocked: false,
		}
	}

	componentDidMount() {
		this.subscription = BeatSaber.TrackQueue.queueSubject.subscribe(state => {
			this.setState(state)
		})
	}

	componentWillUnmount() {
		this.subscription.unsubscribe()
	}

	render() {
		return (
			<div style={{ margin: "0 20px" }}>
				<h2>TrackQueue</h2>
				<Button
					type="blue"
					text="Unlock"
					isDisabled={!this.state.blocked}
					onClick={BeatSaber.TrackQueue.queueUnblock} />
				<br /><br />
				{this.state.enqueued.map(request => (
					<span style={{ marginTop: "5px" }}>
						<b><i>{request.type}</i></b> -
						<code>{request.slug}</code>
						<br />
					</span>
				))}
			</div>
		)
	}
}
