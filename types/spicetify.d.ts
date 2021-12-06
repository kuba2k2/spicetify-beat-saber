declare namespace Spicetify {
	/**
	 * Fetch interesting colors from URI.
	 * @param uri Any type of URI that has artwork (playlist, track, album, artist, show, ...)
	 */
	function colorExtractor(uri: string): Promise<{
		DESATURATED: string
		LIGHT_VIBRANT: string
		PROMINENT: string
		VIBRANT: string
		VIBRANT_NON_ALARMING: string
	}>

	/**
	 * Fetch interesting colors from track album art.
	 * @param uri is optional. Leave it blank to get currrent track
	 * or specify another track uri.
	 */
	function getAblumArtColors(uri?: string): Promise<{
		DESATURATED: string
		LIGHT_VIBRANT: string
		PROMINENT: string
		VIBRANT: string
		VIBRANT_NON_ALARMING: string
	}>

	/**
	 * Fetch track analyzed audio data.
	 * Beware, not all tracks have audio data.
	 * @param uri is optional. Leave it blank to get current track
	 * or specify another track uri.
	 */
	function getAudioData(uri?: string): Promise<any>

	/**
	 * Set of APIs method to register, deregister hotkeys/shortcuts
	 */
	const Keyboard: any

	namespace LocalStorage {
		/**
		 * Empties the list associated with the object of all key/value pairs, if there are any.
		 */
		function clear(): void
		/**
		 * Get key value
		 */
		function get(key: string): string | null
		/**
		 * Delete key
		 */
		function remove(key: string): void
		/**
		 * Set new value for key
		 */
		function set(key: string, value: string): void
	}

	/**
	 * Display a bubble of notification. Useful for a visual feedback.
	 */
	function showNotification(text: string): void

	/**
	 * Popup Modal
	 */
	namespace PopupModal {
		interface Content {
			MODAL_TITLE?: string

			URL?: string
			MESSAGE?: string
			CONTENT?: Element

			AUTOFOCUS_OK_BUTTON?: boolean
			BACKDROP_DONT_COVER_PLAYER?: boolean
			HEIGHT?: number
			PAGE_ID?: string
			HIGH_PRIORITY?: boolean
			MODAL_CLASS?: string

			BUTTONS?: {
				OK?: boolean
				CANCEL?: boolean
			}

			OK_BUTTON_LABEL?: string
			CANCEL_BUTTON_LABEL?: string

			CAN_HIDE_BY_CLICKING_BACKGROUND?: boolean
			CAN_HIDE_BY_PRESSING_ESCAPE?: boolean

			renderReactComponent?: () => React.ReactNode

			onOk?: () => void
			onCancel?: () => void
			onShow?: () => void
			onHide?: () => void
		}

		function display(e: Content): void

		function hide(): void
	}

	type ModalParams = {
		children: React.ReactNode
		title?: string
		className?: string
		isCancelable?: boolean
		okLabel?: string
		cancelLabel?: string
		onOk?: () => void
		onCancel?: () => void
		onShow?: () => void
		onHide?: () => void
	}

	// @ts-ignore
	function showReactModal(data: ModalParams): PopupModal
}

interface IDictionary<T> {
	[key: string]: T
}

type boolstr = "0" | "1"

type AppManifest = {
	AppDescription: IDictionary<string>
	AppName: IDictionary<string>
	BridgeDependencies: IDictionary<string>
	BundleIdentifier: string
	BundleType: "Application" | "Resources"
	BundleVersion: string
	Dependencies: IDictionary<string>
	GitRevision: string
	InjectScripts: boolean
	InjectStylesheets: boolean
	ProvidedFeatures?: IDictionary<boolean>
	ResourceHost?: string
	SkipLanguageValidation: boolean
	SkipUnrequireValidation: boolean
	SpmApp: boolean
	SupportedDeviceClasses: string[]
	SupportedLanguages: string[]
	UserInstallable: boolean
	VendorIdentifier: string
} & IDictionary<any>

type Spotify = {
	app_manifest: AppManifest
	app_uri: string
	app_version: string
	blocked_languages: string[]
	client_version: string
	container_features: {
		autostart: boolean
		clientRestarts: boolean
		clientStorage: boolean
		closeCanMinimizeOrExit: boolean
		isAppX: boolean
		showSystemMediaControls: boolean
		showTrackNotifications: boolean
	}
	developer_mode: boolean
	device_id: string
	double_click_interval: number
	event_sender_client_version: string
	event_sender_installation_id_hex: string
	event_sender_os_name: string
	event_sender_os_version: string
	first_autostart: boolean
	is_running_on_teamcity: boolean
	locale: string
	localization_is_rtl: boolean
	os: object
	platform: string
	platform_string: string
	product_state: {
		ads: boolstr
		"app-developer": boolstr
		catalogue: "free" | "premium"
		collection: boolstr
		country_code: string
		"image-url": string
		name: string
		offline: boolstr
		"preferred-locale": string
		type: "open" | string
	} & IDictionary<string>
	scroller_style: "always" | string
	userUri: string
	username: string
}

interface Window {
	__spotify: Spotify
}
