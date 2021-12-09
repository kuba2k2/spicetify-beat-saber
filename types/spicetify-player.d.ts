declare namespace Spicetify {
	namespace Player {
		/**
		 * Register a listener `type` on Spicetify.Player.
		 *
		 * On default, `Spicetify.Player` always dispatch:
		 *  - `songchange` type when player changes track.
		 *  - `onplaypause` type when player plays or pauses.
		 *  - `onprogress` type when track progress changes.
		 *  - `appchange` type when user changes page.
		 */
		function addEventListener(
			type: string,
			callback: (event?: Event) => void
		): void

		function addEventListener(
			type: "songchange",
			callback: (event?: Event) => void
		): void

		function addEventListener(
			type: "onplaypause",
			callback: (event?: Event) => void
		): void

		function addEventListener(
			type: "onprogress",
			callback: (event?: Event | { data: number }) => void
		): void

		type AppEvent = {
			/**
			 * App ID
			 */
			id: string
			/**
			 * App URI
			 */
			uri: string
		}

		type AppEmbeddedEvent = {
			/**
			 * Whether app is embedded element or an Iframe
			 */
			isEmbeddedApp: true

			/**
			 * App container HTML element or Iframe element
			 */
			container: HTMLElement
		} & AppEvent

		type AppIframeEvent = {
			/**
			 * Whether app is embedded element or an Iframe
			 */
			isEmbeddedApp: false
			/**
			 * App container
			 */
			container: HTMLIFrameElement
		} & AppEvent

		function addEventListener(
			type: "appchange",
			callback: (
				event?: Event & {
					data: AppEmbeddedEvent | AppIframeEvent
				}
			) => void
		): void

		/**
		 * Skip to previous track.
		 */
		function back(): void

		/**
		 * An object contains all information about current track and player.
		 */
		const data: any

		/**
		 * Decrease a small amount of volume.
		 */
		function decreaseVolume(): void

		/**
		 * Dispatches an event at `Spicetify.Player`.
		 *
		 * On default, `Spicetify.Player` always dispatch
		 *  - `songchange` type when player changes track.
		 *  - `onplaypause` type when player plays or pauses.
		 *  - `onprogress` type when track progress changes.
		 *  - `appchange` type when user changes page.
		 */
		function dispatchEvent(event: Event): void
		const eventListeners: {
			[key: string]: ((event?: Event) => void)[]
		}

		/**
		 * Convert milisecond to `mm:ss` format
		 * @param milisecond
		 */
		function formatTime(milisecond: number): string

		/**
		 * Return song total duration in milisecond.
		 */
		function getDuration(): number

		/**
		 * Return mute state
		 */
		function getMute(): boolean

		/**
		 * Return elapsed duration in milisecond.
		 */
		function getProgress(): number

		/**
		 * Return elapsed duration in percentage (0 to 1).
		 */
		function getProgressPercent(): number

		/**
		 * Return current Repeat state (No repeat = 0/Repeat all = 1/Repeat one = 2).
		 */
		function getRepeat(): number

		/**
		 * Return current shuffle state.
		 */
		function getShuffle(): boolean

		/**
		 * Return track heart state.
		 */
		function getHeart(): boolean

		/**
		 * Return current volume level (0 to 1).
		 */
		function getVolume(): number

		/**
		 * Increase a small amount of volume.
		 */
		function increaseVolume(): void

		/**
		 * Return a boolean whether player is playing.
		 */
		function isPlaying(): boolean

		/**
		 * Skip to next track.
		 */
		function next(): void

		/**
		 * Pause track.
		 */
		function pause(): void

		/**
		 * Resume track.
		 */
		function play(): void

		/**
		 * Unregister added event listener `type`.
		 * @param type
		 * @param callback
		 */
		function removeEventListener(
			type: string,
			callback: (event?: Event) => void
		): void

		/**
		 * Seek track to position.
		 * @param position can be in percentage (0 to 1) or in milisecond.
		 */
		function seek(position: number): void

		/**
		 * Turn mute on/off
		 * @param state
		 */
		function setMute(state: boolean): void

		/**
		 * Change Repeat mode
		 * @param mode `0` No repeat. `1` Repeat all. `2` Repeat one track.
		 */
		function setRepeat(mode: number): void

		/**
		 * Turn shuffle on/off.
		 * @param state
		 */
		function setShuffle(state: boolean): void

		/**
		 * Set volume level
		 * @param level 0 to 1
		 */
		function setVolume(level: number): void

		/**
		 * Seek to previous `amount` of milisecond
		 * @param amount in milisecond. Default: 15000.
		 */
		function skipBack(amount?: number): void

		/**
		 * Seek to next  `amount` of milisecond
		 * @param amount in milisecond. Default: 15000.
		 */
		function skipForward(amount?: number): void

		/**
		 * Toggle Heart (Favourite) track state.
		 */
		function toggleHeart(): void

		/**
		 * Toggle Mute/No mute.
		 */
		function toggleMute(): void

		/**
		 * Toggle Play/Pause.
		 */
		function togglePlay(): void

		/**
		 * Toggle No repeat/Repeat all/Repeat one.
		 */
		function toggleRepeat(): void

		/**
		 * Toggle Shuffle/No shuffle.
		 */
		function toggleShuffle(): void
	}

	/**
	 * Adds a track/album or array of tracks/albums to prioritized queue.
	 */
	function addToQueue(uri: string | string[]): Promise<void>

	/**
	 * Use to force playing a track/episode/album/show/playlist/artist URI.
	 */
	namespace PlaybackControl {
		/**
		 * Set either `index` or `trackUri`
		 */
		interface ResolverOption {
			index?: number
			trackUri?: string
			seekTo?: number
		}

		/**
		 * Request to play a context through the cosmos track resolver.
		 * @param contextUri Context URI.
		 * @param playOptions An object with play options.
		 * @param callback Optional callback function.
		 */
		function playFromResolver(
			contextUri: string,
			playOptions: ResolverOption,
			callback?: Function
		): void

		interface ContextObject {
			pages?: any
			metadata?: { "zelda.context_uri": string }
			entity_uri?: string
			uri?: string
			url?: string
		}

		interface ContextOption {
			index?: number | null
			range?: any
			uid?: string
			uri?: string
			page?: number
		}

		/**
		 * Play a context directly, only supported on context player
		 *
		 * @param context Context object that CP can deal with.
		 * @param playOptions An object with play options.
		 * @param callback Optional callback function.
		 */
		function playContext(
			context: ContextObject,
			playOptions: ContextOption,
			callback?: Function
		): void

		/**
		 * Update the player with a new context without changing what is currently
		 * playing.
		 *
		 * @param context Context object that CP can deal with.
		 * @param callback Optional callback function.
		 */
		function updateContext(
			context: ContextObject,
			callback?: Function
		): void

		interface PlaylistResolverOptions {
			context: string
			uids?: string[]
			uid?: string
			uris?: string[]
			trackUri?: string
			// fills in source_start & source_end
			// example values: browse, playlist-owned-by-self-non-collaborative
			source?: string
			// fills in referer
			// example values: spotify:app:browse
			referrerId?: string
			// fills in referrer version
			referrerVersion?: string
		}

		/**
		 * Request to play a context through the playlist resolver.
		 *
		 * @param contextUri Context URI.
		 * @param playOptions An object with play options.
		 * @param callback Optional callback function.
		 */
		function playFromPlaylistResolver(
			contextUri: string,
			playOptions: PlaylistResolverOptions,
			callback?: Function
		): void

		interface CollectionResolverOption {
			context: string
			index: number | null
			// fills in source_start & source_end
			// example values: browse, playlist-owned-by-self-non-collaborative
			source?: string
			// fills in referer
			// example values: spotify:app:browse
			referrerId?: string
			// fills in referrer version
			referrerVersion?: string
		}

		/**
		 * Request to play a context through the collection resolver.
		 *
		 * @param contextUri Context URI.
		 * @param playOptions An object with play options.
		 * @param callback Optional callback function.
		 */
		function playFromCollectionResolver(
			contextUri: string,
			playOptions: CollectionResolverOption,
			callback?: Function
		): void

		/**
		 * Request to play a single track.
		 *
		 * @param uri The track URI.
		 * @param playOptions An object with play options.
		 * @param callback Optional callback function.
		 */
		function playTrack(
			uri: string,
			playOptions: Object,
			callback?: Function
		): void

		interface RowsOption {
			index: number | null
			range?: any
			uid?: string
			uri?: string
			page?: number
		}

		/**
		 * Request to play tracks found in the list of rows.
		 *
		 * @param rows A live list of rows with tracks.
		 * @param playOptions An object with play options.
		 * @param callback Optional callback function.
		 */
		function playRows(
			rows: any,
			playOptions: RowsOption,
			callback?: Function
		): void

		/**
		 * Request to play artist context.
		 *
		 * @param uri Context URI.
		 * @param playOptions An object with play options.
		 * @param callback Optional callback function.
		 */
		function playFromArtist(
			uri: string,
			playOptions: ResolverOption,
			callback?: Function
		): void

		/**
		 * Request to update the player with tracks from the provided rows list.
		 * This will update the player silently without interrupting playback.
		 *
		 * @param rows A live list of rows with tracks.
		 * @param playOptions An object with play options.
		 * @param callback Optional callback function.
		 */
		function updateWithRows(
			rows: any,
			playOptions: Object,
			callback?: Function
		): void

		function pause(callback?: Function): void

		function resume(callback?: Function): void

		function skipPrev(callback?: Function): void

		function skipNext(callback?: Function): void
	}

	/**
	 * Queue object contains list of queuing tracks,
	 * history of played tracks and current track metadata.
	 */
	const Queue: {
		next_tracks: any[]
		prev_tracks: any[]
		revision: string
		track: any
	}

	/**
	 * Remove a track/album or array of tracks/albums from current queue.
	 */
	function removeFromQueue(uri: string | string[]): Promise<void>
}
