(function BeatSaberShim() {
	const iframe = document.createElement("iframe");
	iframe.id = "beatsaber-app-resolver";
	if (navigator.userAgent.includes("Spotify")) {
		iframe.src = "spotify:app:beatsaber:shim";
	} else {
		iframe.src = "https://localhost/";
	}
	iframe.style.display = "none";
	iframe.onload = () => {
		const script = document.createElement("script");
		script.src = "https://beatsaber.app.spotify.com/beatsaber.bundle.js";
		const style = document.createElement("link");
		style.rel = "stylesheet";
		style.href = "https://beatsaber.app.spotify.com/css/beatsaber.css";
		document.head.appendChild(style);
		document.body.appendChild(script);
	};
	document.body.appendChild(iframe);
})();
