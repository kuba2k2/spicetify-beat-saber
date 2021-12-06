declare namespace Spicetify {
	namespace Model {
		type Icon = "add-to-playlist" | "add-to-queue" | "addfollow" | "addfollowers" | "addsuggestedsong" | "airplay" | "album" | "album-contained" | "arrow-down" | "arrow-left" | "arrow-right" | "arrow-up" | "artist" | "artist-active" | "attach" | "available-offline" | "ban" | "ban-active" | "block" | "bluetooth" | "browse" | "browse-active" | "camera" | "carplay" | "chart-down" | "chart-new" | "chart-up" | "check" | "check-alt" | "chevron-down" | "chevron-left" | "chevron-right" | "chevron-up" | "chromecast-connected" | "chromecast-connecting-one" | "chromecast-connecting-three" | "chromecast-connecting-two" | "chromecast-disconnected" | "collaborative-playlist" | "collection" | "collection-active" | "connect-to-devices" | "copy" | "destination-pin" | "device-arm" | "device-car" | "device-computer" | "device-mobile" | "device-multispeaker" | "device-other" | "device-speaker" | "device-tablet" | "device-tv" | "devices" | "devices-alt" | "discover" | "download" | "downloaded" | "drag-and-drop" | "edit" | "email" | "events" | "facebook" | "facebook-messenger" | "filter" | "flag" | "follow" | "fullscreen" | "games-console" | "gears" | "googleplus" | "grid-view" | "headphones" | "heart" | "heart-active" | "helpcircle" | "highlight" | "home" | "home-active" | "inbox" | "info" | "instagram" | "library" | "lightning" | "line" | "list-view" | "localfile" | "locked" | "locked-active" | "lyrics" | "make-available-offline" | "make—available-offline" | "me-alt" | "me-alt-active" | "menu" | "messages" | "mic" | "minimise" | "mix" | "more" | "more-alt" | "more-android" | "new-spotify-connect" | "new-volume" | "newradio" | "nikeplus" | "notifications" | "now-playing" | "now-playing-active" | "offline" | "offline-sync" | "pause" | "payment" | "paymenthistory" | "play" | "playback-speed-0point5x" | "playback-speed-0point8x" | "playback-speed-1point2x" | "playback-speed-1point5x" | "playback-speed-1x" | "playback-speed-2x" | "playback-speed-3x" | "playlist" | "playlist-folder" | "plus" | "plus-2px" | "plus-alt" | "podcasts" | "podcasts-active" | "public" | "queue" | "queue-number" | "radio" | "radio-active" | "radioqueue" | "redeem" | "refresh" | "released" | "released-alt" | "repeat" | "repeatonce" | "report-abuse" | "running" | "search" | "search-active" | "sendto" | "share" | "share-android" | "sharetofollowers" | "shows" | "shuffle" | "skip" | "skip-active" | "skip-back" | "skip-forward" | "skipback15" | "skipforward15" | "sleeptimer" | "sms" | "sort" | "sort-down" | "sort-up" | "sortdown" | "sortup" | "spotify-connect" | "spotify-connect-alt" | "spotify-connect-onewave" | "spotify-connect-twowave" | "spotifylogo" | "spotifypremium" | "star" | "star-alt" | "subtitles" | "tag" | "thumbs-down" | "thumbs-up" | "time" | "topcountry" | "track" | "trending" | "trending-active" | "tumblr" | "twitter" | "user" | "user-active" | "user-alt" | "user-alt-active" | "user-circle" | "video" | "volume" | "volume-off" | "volume-onewave" | "volume-twowave" | "warning" | "watch" | "whatsapp" | "x"

		type Linkable = {
			name: string
			uri: string
		}

		type Track = {
			artists: Linkable[]
			duration: number
			featuredArtists: Linkable[]
			index: number
			isAdded: boolean
			isExplicit: boolean
			isPlayable: boolean
			isPremiumOnly: boolean
			number: number
			playCount: number
			popularity: number
		} & Linkable

		type PlayerState = {
			contextUri: string
			index: {
				page: number
				track: number
			}
			isPaused: boolean
			isPlaying: boolean
			playbackSpeed: number
			playerVariantUri: string
			previousPlaybackSpeed: number
			track: {
				isPodcastAd: boolean
				isSkippableAdBreak: boolean
				mediaType: "audio" | "video"
				uri: string
			}
		}
	}
}
