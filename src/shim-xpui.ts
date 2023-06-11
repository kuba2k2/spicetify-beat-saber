import React from "react"

class BeatSaberWrapper extends React.Component {
	render() {
		console.log("[BeatSaber/Xpui] Rendering app page")
		if (BeatSaber && BeatSaber.Core) {
			return BeatSaber.Core.wrapComponent(
				BeatSaber.Core.getAppPage(),
				window.document
			)
		}
		setTimeout(() => {
			this.forceUpdate()
		}, 1000)
		return React.createElement("h1", "Loading...")
	}
}

export default function render() {
	return React.createElement(BeatSaberWrapper)
}
