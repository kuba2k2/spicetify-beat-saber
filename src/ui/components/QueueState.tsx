import { Subscription } from "rxjs"
import { QueueRequest } from "../../core/queue/requests/QueueRequest"

type QueueStateState = {
	items: QueueRequest[]
	blocked: boolean
}

export class QueueState extends Spicetify.React.Component<unknown, QueueStateState> {
	subscription: Subscription

	constructor() {
		super({})
		this.state = {
			items: [],
			blocked: false,
		}
	}

	componentDidMount() {
		this.subscription = BeatSaber.TrackQueue.queueSubject.subscribe(state => {
			if (state === true || state === false) {
				this.setState({ blocked: state })
			} else {
				this.setState({ items: state })
			}
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
				{this.state.items.map(request => (
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
