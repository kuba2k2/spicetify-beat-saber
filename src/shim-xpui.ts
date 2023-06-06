import React from "react"

class BeatSaberWrapper extends React.Component {
	render() {
		if (BeatSaber && BeatSaber.Core) return BeatSaber.Core.getAppPage()
		setTimeout(() => {
			this.forceUpdate()
		}, 1000)
		return React.createElement("h1", "Loading...")
	}
}

export default function render() {
	return React.createElement(BeatSaberWrapper)
}
