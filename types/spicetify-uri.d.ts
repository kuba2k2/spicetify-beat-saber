declare namespace Spicetify {
	/**
	 * Set of APIs method to parse and validate URIs.
	 */
	class URI {
		constructor(type: string, props: any)
		public type: string
		public id: string

		/**
		 * Creates an application URI object from the current URI object.
		 *
		 * If the current URI object is already an application type, a copy is made.
		 *
		 * @return The current URI as an application URI.
		 */
		toAppType(): URI

		/**
		 * Creates a URI object from an application URI object.
		 *
		 * If the current URI object is not an application type, a copy is made.
		 *
		 * @return The current URI as a real typed URI.
		 */
		toRealType(): URI

		/**
		 *
		 * @return The URI representation of this uri.
		 */
		toURI(): string

		/**
		 *
		 * @return The URI representation of this uri.
		 */
		toString(): string

		/**
		 * Get the URL path of this uri.
		 *
		 * @param opt_leadingSlash True if a leading slash should be prepended.
		 * @return The path of this uri.
		 */
		toURLPath(opt_leadingSlash: boolean): string

		/**
		 *
		 * @return The Play URL string for the uri.
		 */
		toPlayURL(): string

		/**
		 *
		 * @return The Image URL string for the uri.
		 */
		toImageURL(): string

		/**
		 *
		 * @return The URL string for the uri.
		 */
		toURL(): string

		/**
		 *
		 * @return The Open URL string for the uri.
		 */
		toOpenURL(): string

		/**
		 *
		 * @return The Play HTTPS URL string for the uri.
		 */
		toSecurePlayURL(): string

		/**
		 *
		 * @return The HTTPS URL string for the uri.
		 */
		toSecureURL(): string

		/**
		 *
		 * @return The Open HTTPS URL string for the uri.
		 */
		toSecureOpenURL(): string

		/**
		 *
		 * @return The id of the uri as a bytestring.
		 */
		idToByteString(): string

		getPath(): string

		getBase62Id(): string

		/**
		 * Checks whether two URI:s refer to the same thing even though they might
		 * not necessarily be equal.
		 *
		 * These two Playlist URIs, for example, refer to the same playlist:
		 *
		 *   spotify:user:napstersean:playlist:3vxotOnOGDlZXyzJPLFnm2
		 *   spotify:playlist:3vxotOnOGDlZXyzJPLFnm2
		 *
		 * @param uri The uri to compare identity for.
		 * @return Whether they shared idenitity
		 */
		isSameIdentity(uri: any): boolean

		/**
		 * The various URI Types.
		 *
		 * Note that some of the types in this enum are not real URI types, but are
		 * actually URI particles. They are marked so.
		 *
		 */
		static Type: {
			EMPTY: string
			ALBUM: string
			AD: string
			/** URI particle not an actual URI. */
			APP: string
			APPLICATION: string
			ARTIST: string
			ARTIST_TOPLIST: string
			AUDIO_FILE: string
			COLLECTION: string
			COLLECTION_ALBUM: string
			COLLECTION_MISSING_ALBUM: string
			COLLECTION_ARTIST: string
			CONTEXT_GROUP: string
			DAILY_MIX: string
			EPISODE: string
			/** URI particle not an actual URI. */
			FACEBOOK: string
			FOLDER: string
			FOLLOWERS: string
			FOLLOWING: string
			/** URI particle not an actual URI. */
			GLOBAL: string
			IMAGE: string
			INBOX: string
			LOCAL_ARTIST: string
			LOCAL_ALBUM: string
			LOCAL: string
			LIBRARY: string
			MOSAIC: string
			PLAYLIST: string
			/** Only used for URI classification. Not a valid URI fragment. */
			PLAYLIST_V2: string
			PROFILE: string
			PUBLISHED_ROOTLIST: string
			RADIO: string
			ROOTLIST: string
			COLLECTION_TRACK_LIST: string
			SEARCH: string
			SHOW: string
			CONCERT: string
			SPECIAL: string
			STARRED: string
			STATION: string
			TEMP_PLAYLIST: string
			/** URI particle not an actual URI. */
			TOP: string
			TOPLIST: string
			TRACK: string
			TRACKSET: string
			/** URI particle not an actual URI. */
			USER: string
			USER_TOPLIST: string
			USER_TOP_TRACKS: string
		}

		/**
		 * Creates a new URI object from a parsed string argument.
		 *
		 * @param str The string that will be parsed into a URI object.
		 * @throws TypeError If the string argument is not a valid URI, a TypeError will
		 *     be thrown.
		 * @return The parsed URI object.
		 */
		static fromString(str: string): URI

		/**
		 * Parses a given object into a URI instance.
		 *
		 * Unlike URI.fromString, this function could receive any kind of value. If
		 * the value is already a URI instance, it is simply returned.
		 * Otherwise the value will be stringified before parsing.
		 *
		 * This function also does not throw an error like URI.fromString, but
		 * instead simply returns null if it can't parse the value.
		 *
		 * @param value The value to parse.
		 * @return The corresponding URI instance, or null if the
		 *     passed value is not a valid value.
		 */
		static from(value: any): URI | null

		/**
		 * Creates a new URI from a bytestring.
		 *
		 * @param type The type of the URI.
		 * @param idByteString The ID of the URI as a bytestring.
		 * @param opt_args Optional arguments to the URI constructor.
		 * @return The URI object created.
		 */
		static fromByteString(
			type: string,
			idByteString: string,
			opt_args?: any
		): URI

		/**
		 * Clones a given SpotifyURI instance.
		 *
		 * @param uri The uri to clone.
		 * @return An instance of URI.
		 */
		static clone(uri: URI): URI | null

		/**
		 * Returns the canonical representation of a username.
		 *
		 * @param username The username to encode.
		 * @return The encoded canonical representation of the username.
		 */
		static getCanonicalUsername(username: string): string

		/**
		 * Returns the non-canonical representation of a username.
		 *
		 * @param username The username to encode.
		 * @return The unencoded canonical representation of the username.
		 */
		static getDisplayUsername(username: string): string

		/**
		 * Returns the hex representation of a Base62 encoded id.
		 *
		 * @param id The base62 encoded id.
		 * @return The hex representation of the base62 id.
		 */
		static idToHex(id: string): string

		/**
		 * Returns the base62 representation of a hex encoded id.
		 *
		 * @param hex The hex encoded id.
		 * @return The base62 representation of the id.
		 */
		static hexToId(hex: string): string

		/**
		 * Creates a new empty URI.
		 *
		 * @return The empty URI.
		 */
		static emptyURI(): URI

		/**
		 * Creates a new 'album' type URI.
		 *
		 * @param id The id of the album.
		 * @param disc The disc number of the album.
		 * @return The album URI.
		 */
		static albumURI(id: string, disc: number): URI

		/**
		 * Creates a new 'ad' type URI.
		 *
		 * @param id The id of the ad.
		 * @return The ad URI.
		 */
		static adURI(id: string): URI

		/**
		 * Creates a new 'audiofile' type URI.
		 *
		 * @param extension The extension of the audiofile.
		 * @param id The id of the extension.
		 * @return The audiofile URI.
		 */
		static audioFileURI(extension: string, id: string): URI

		/**
		 * Creates a new 'artist' type URI.
		 *
		 * @param id The id of the artist.
		 * @return The artist URI.
		 */
		static artistURI(id: string): URI

		/**
		 * Creates a new 'artist-toplist' type URI.
		 *
		 * @param id The id of the artist.
		 * @param toplist The toplist type.
		 * @return The artist-toplist URI.
		 */
		static artistToplistURI(id: string, toplist: string): URI

		/**
		 * Creates a new 'dailymix' type URI.
		 *
		 * @param args An array of arguments for the dailymix.
		 * @return The dailymix URI.
		 */
		static dailyMixURI(args: string[]): URI

		/**
		 * Creates a new 'search' type URI.
		 *
		 * @param query The unencoded search query.
		 * @return The search URI
		 */
		static searchURI(query: string): URI

		/**
		 * Creates a new 'track' type URI.
		 *
		 * @param id The id of the track.
		 * @param anchor The point in the track formatted as mm:ss
		 * @param context An optional context URI
		 * @param play Toggles autoplay
		 * @return The track URI.
		 */
		static trackURI(
			id: string,
			anchor: string,
			context: string,
			play: boolean
		): URI

		/**
		 * Creates a new 'trackset' type URI.
		 *
		 * @param tracks An array of 'track' type URIs.
		 * @param name The name of the trackset.
		 * @param index The index in the trackset.
		 * @return The trackset URI.
		 */
		static tracksetURI(tracks: URI[], name: string, index: number): URI

		/**
		 * Creates a new 'facebook' type URI.
		 *
		 * @param uid The user id.
		 * @return The facebook URI.
		 */
		static facebookURI(uid: string): URI

		/**
		 * Creates a new 'followers' type URI.
		 *
		 * @param username The non-canonical username.
		 * @return The followers URI.
		 */
		static followersURI(username: string): URI

		/**
		 * Creates a new 'following' type URI.
		 *
		 * @param username The non-canonical username.
		 * @return The following URI.
		 */
		static followingURI(username: string): URI

		/**
		 * Creates a new 'playlist' type URI.
		 *
		 * @param username The non-canonical username of the playlist owner.
		 * @param id The id of the playlist.
		 * @return The playlist URI.
		 */
		static playlistURI(username: string, id: string): URI

		/**
		 * Creates a new 'playlist-v2' type URI.
		 *
		 * @param id The id of the playlist.
		 * @return The playlist URI.
		 */
		static playlistV2URI(id: string): URI

		/**
		 * Creates a new 'folder' type URI.
		 *
		 * @param username The non-canonical username of the folder owner.
		 * @param id The id of the folder.
		 * @return The folder URI.
		 */
		static folderURI(username: string, id: string): URI

		/**
		 * Creates a new 'collectiontracklist' type URI.
		 *
		 * @param username The non-canonical username of the collection owner.
		 * @param id The id of the tracklist.
		 * @return The collectiontracklist URI.
		 */
		static collectionTrackList(username: string, id: string): URI

		/**
		 * Creates a new 'starred' type URI.
		 *
		 * @param username The non-canonical username of the starred list owner.
		 * @return The starred URI.
		 */
		static starredURI(username: string): URI

		/**
		 * Creates a new 'user-toplist' type URI.
		 *
		 * @param username The non-canonical username of the toplist owner.
		 * @param toplist The toplist type.
		 * @return The user-toplist URI.
		 */
		static userToplistURI(username: string, toplist: string): URI

		/**
		 * Creates a new 'user-top-tracks' type URI.
		 *
		 * @deprecated
		 * @param username The non-canonical username of the toplist owner.
		 * @return The user-top-tracks URI.
		 */
		static userTopTracksURI(username: string): URI

		/**
		 * Creates a new 'toplist' type URI.
		 *
		 * @param toplist The toplist type.
		 * @param country The country code for the toplist.
		 * @param global True if this is a global rather than a country list.
		 * @return The toplist URI.
		 */
		static toplistURI(
			toplist: string,
			country: string,
			global: boolean
		): URI

		/**
		 * Creates a new 'inbox' type URI.
		 *
		 * @param username The non-canonical username of the inbox owner.
		 * @return The inbox URI.
		 */
		static inboxURI(username: string): URI

		/**
		 * Creates a new 'rootlist' type URI.
		 *
		 * @param username The non-canonical username of the rootlist owner.
		 * @return The rootlist URI.
		 */
		static rootlistURI(username: string): URI

		/**
		 * Creates a new 'published-rootlist' type URI.
		 *
		 * @param username The non-canonical username of the published-rootlist owner.
		 * @return The published-rootlist URI.
		 */
		static publishedRootlistURI(username: string): URI

		/**
		 * Creates a new 'local-artist' type URI.
		 *
		 * @param artist The artist name.
		 * @return The local-artist URI.
		 */
		static localArtistURI(artist: string): URI

		/**
		 * Creates a new 'local-album' type URI.
		 *
		 * @param artist The artist name.
		 * @param album The album name.
		 * @return The local-album URI.
		 */
		static localAlbumURI(artist: string, album: string): URI

		/**
		 * Creates a new 'local' type URI.
		 *
		 * @param artist The artist name.
		 * @param album The album name.
		 * @param track The track name.
		 * @param duration The track duration in ms.
		 * @return The local URI.
		 */
		static localURI(
			artist: string,
			album: string,
			track: string,
			duration: number
		): URI

		/**
		 * Creates a new 'library' type URI.
		 *
		 * @param username The non-canonical username of the rootlist owner.
		 * @param category The category of the library.
		 * @return The library URI.
		 */
		static libraryURI(username: string, category: string): URI

		/**
		 * Creates a new 'collection' type URI.
		 *
		 * @param username The non-canonical username of the rootlist owner.
		 * @param category The category of the collection.
		 * @return The collection URI.
		 */
		static collectionURI(username: string, category: string): URI

		/**
		 * Creates a new 'temp-playlist' type URI.
		 *
		 * @param origin The origin of the temporary playlist.
		 * @param data Additional data for the playlist.
		 * @return The temp-playlist URI.
		 */
		static temporaryPlaylistURI(origin: string, data: string): URI

		/**
		 * Creates a new 'context-group' type URI.
		 *
		 * @deprecated
		 * @param origin The origin of the temporary playlist.
		 * @param name The name of the context group.
		 * @return The context-group URI.
		 */
		static contextGroupURI(origin: string, name: string): URI

		/**
		 * Creates a new 'profile' type URI.
		 *
		 * @param username The non-canonical username of the rootlist owner.
		 * @param args A list of arguments.
		 * @return The profile URI.
		 */
		static profileURI(username: string, args: string[]): URI

		/**
		 * Creates a new 'image' type URI.
		 *
		 * @param id The id of the image.
		 * @return The image URI.
		 */
		static imageURI(id: string): URI

		/**
		 * Creates a new 'mosaic' type URI.
		 *
		 * @param ids The ids of the mosaic immages.
		 * @return The mosaic URI.
		 */
		static mosaicURI(ids: string[]): URI

		/**
		 * Creates a new 'radio' type URI.
		 *
		 * @param args The radio seed arguments.
		 * @return The radio URI.
		 */
		static radioURI(args: string): URI

		/**
		 * Creates a new 'special' type URI.
		 *
		 * @param args An array containing the other arguments.
		 * @return The special URI.
		 */
		static specialURI(args: string[]): URI

		/**
		 * Creates a new 'station' type URI.
		 *
		 * @param args An array of arguments for the station.
		 * @return The station URI.
		 */
		static stationURI(args: string[]): URI

		/**
		 * Creates a new 'application' type URI.
		 *
		 * @param id The id of the application.
		 * @param args An array containing the arguments to the app.
		 * @return The application URI.
		 */
		static applicationURI(id: string, args: string[]): URI

		/**
		 * Creates a new 'collection-album' type URI.
		 *
		 * @param username The non-canonical username of the rootlist owner.
		 * @param id The id of the album.
		 * @return The collection-album URI.
		 */
		static collectionAlbumURI(username: string, id: string): URI

		/**
		 * Creates a new 'collection-album-missing' type URI.
		 *
		 * @param username The non-canonical username of the rootlist owner.
		 * @param id The id of the album.
		 * @return The collection-album-missing URI.
		 */
		static collectionMissingAlbumURI(username: string, id: string): URI

		/**
		 * Creates a new 'collection-artist' type URI.
		 *
		 * @param username The non-canonical username of the rootlist owner.
		 * @param id The id of the artist.
		 * @return The collection-artist URI.
		 */
		static collectionArtistURI(username: string, id: string): URI

		/**
		 * Creates a new 'episode' type URI.
		 *
		 * @param id The id of the episode.
		 * @param context An optional context URI
		 * @param play Toggles autoplay in the episode URI
		 * @return The episode URI.
		 */
		static episodeURI(id: string, context: string, play: boolean): URI

		/**
		 * Creates a new 'show' type URI.
		 *
		 * @param id The id of the show.
		 * @return The show URI.
		 */
		static showURI(id: string): URI

		/**
		 * Creates a new 'concert' type URI.
		 *
		 * @param id The id of the concert.
		 * @return The concert URI.
		 */
		static concertURI(id: string): URI

		static isAlbum(uri: any): boolean
		static isAd(uri: any): boolean
		static isApplication(uri: any): boolean
		static isArtist(uri: any): boolean
		static isCollection(uri: any): boolean
		static isCollectionAlbum(uri: any): boolean
		static isCollectionArtist(uri: any): boolean
		static isDailyMix(uri: any): boolean
		static isEpisode(uri: any): boolean
		static isFacebook(uri: any): boolean
		static isFolder(uri: any): boolean
		static isImage(uri: any): boolean
		static isLocalArtist(uri: any): boolean
		static isLocalAlbum(uri: any): boolean
		static isLocalTrack(uri: any): boolean
		static isMosaic(uri: any): boolean
		static isPlaylistV1(uri: any): boolean
		static isPlaylistV2(uri: any): boolean
		static isRadio(uri: any): boolean
		static isRootlist(uri: any): boolean
		static isSearch(uri: any): boolean
		static isShow(uri: any): boolean
		static isConcert(uri: any): boolean
		static isStation(uri: any): boolean
		static isTrack(uri: any): boolean
		static isProfile(uri: any): boolean
		static isPlaylistV1OrV2(uri: any): boolean
	}
}
