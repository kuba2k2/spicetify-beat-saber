type ApiPartnerSource = {
	url: string
	width: number
	height: number
}

type ApiPartnerImage = {
	sources: ApiPartnerSource[]
	extractedColors?: {
		colorRaw?: {
			hex?: string
		}
	}
}

export type ApiPartnerArtist = {
	uri: string
	visuals: {
		gallery: {
			items: ApiPartnerImage[]
		}
		avatarImage: ApiPartnerImage
		headerImage: ApiPartnerImage
	}
}
