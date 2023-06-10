type URIType = "track" | "artist" | "album" | "playlist" | "image"

export default class URI {
	type: URIType
	id: string

	constructor(data: any) {
		if (typeof data == "string") {
			if (data.startsWith("spotify:")) {
				const parts = data.split(":")
				this.type = parts[1] as URIType
				this.id = parts[2]
			}
			if (
				data.startsWith("https://") &&
				data.includes("i.scdn.co/image")
			) {
				const parts = data.split("/")
				this.type = "image"
				this.id = parts[4]
			}
		}
		if (typeof data == "object") {
			this.type = data.type
			this.id = data.id ?? data._base62Id ?? data._hexId
		}

		if (!this.type) {
			throw new Error("Invalid data")
		}
	}

	static from(data: any): URI | null {
		try {
			return data ? new URI(data) : null
		} catch {
			return null
		}
	}

	public toString(): string {
		return `spotify:${this.type}:${this.id}`
	}

	public toImageURL(): string {
		return `https://i.scdn.co/image/${this.id}`
	}
}
