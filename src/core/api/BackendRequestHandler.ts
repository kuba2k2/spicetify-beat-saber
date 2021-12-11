import {
	BsaberGetRequest,
	BsaberPostRequest,
	BsaberResponse,
	RequestHandler,
} from "beastsaber-api/lib/RequestHandler"
import { Cookie, CookieJar } from "tough-cookie"

type BsaberRequest = (BsaberGetRequest | BsaberPostRequest) & {
	method: "GET" | "POST"
	domain: string
}

export class BackendRequestHandler implements RequestHandler {
	cookieJar: CookieJar
	domain: string
	baseUrl: string

	constructor(domain: string) {
		this.get = this.get.bind(this)
		this.post = this.post.bind(this)

		const cookies = Spicetify.LocalStorage.get("beatsaber:cookies")
		if (!cookies) {
			this.cookieJar = new CookieJar()
			return
		}
		this.cookieJar = CookieJar.fromJSON(cookies)
		this.domain = domain
		this.baseUrl = `https://${this.domain}`
	}

	get proxyUrl(): string {
		return `http://${BeatSaber.Settings.backendHostname}/proxy/`
	}

	get proxyHeaders(): Record<string, string> {
		return {
			Authorization: `Basic ${BeatSaber.Settings.backendAuth}`,
			"Content-Type": "application/json",
		}
	}

	private async loadCookies(request: BsaberRequest) {
		const url = `https://${request.domain}${request.endpoint}`
		const cookies = await this.cookieJar.getCookieString(url)
		if (!request.headers) {
			request.headers = {}
		}
		request.headers["Cookie"] = cookies
	}

	private async saveCookies(response: BsaberResponse) {
		const cookies = response.headers["set-cookie"]
		if (!cookies) return
		for (const cookie of cookies) {
			const cookieObj = Cookie.parse(cookie)
			cookieObj.domain = this.domain
			await this.cookieJar.setCookie(cookieObj, response.url)
		}
		this.cookieJar.serialize((err, cookies) => {
			Spicetify.LocalStorage.set(
				"beatsaber:cookies",
				JSON.stringify(cookies)
			)
		})
	}

	private async request(
		method: "GET" | "POST",
		request: BsaberRequest
	): Promise<BsaberResponse> {
		request.method = method
		request.domain = this.domain
		await this.loadCookies(request)
		const response = (await Spicetify.CosmosAsync.post(
			this.proxyUrl,
			request,
			this.proxyHeaders
		)) as BsaberResponse
		await this.saveCookies(response)
		return response
	}

	async get(request: BsaberGetRequest): Promise<BsaberResponse> {
		return await this.request("GET", request as BsaberRequest)
	}

	async post(request: BsaberPostRequest): Promise<BsaberResponse> {
		return await this.request("POST", request as BsaberRequest)
	}
}
