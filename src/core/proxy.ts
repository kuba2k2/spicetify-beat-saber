type RequestType = "http" | "cosmos"

export class RequestProxy {
	attached = false
	fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
	cosmos: (arg1: any, arg2?: any) => any

	constructor() {
		this.proxyFetch = this.proxyFetch.bind(this)
		this.proxyCosmosZlink = this.proxyCosmosZlink.bind(this)
		this.proxyCosmosXpui = this.proxyCosmosXpui.bind(this)
	}

	public attach() {
		if (this.attached) return
		this.attachFetch()
		if (BeatSaber.IsZlink) this.attachCosmosZlink()
		if (BeatSaber.IsXpui) this.attachCosmosXpui()
		this.attached = true
	}

	public detach() {
		if (!this.attached) return
		this.detachFetch()
		if (BeatSaber.IsZlink) this.detachCosmosZlink()
		if (BeatSaber.IsXpui) this.detachCosmosXpui()
		this.attached = false
	}

	attachFetch() {
		this.fetch = window.fetch
		window.fetch = this.proxyFetch
		console.log("[Proxy] Attached fetch() proxy")
	}

	detachFetch() {
		window.fetch = this.fetch
	}

	attachCosmosZlink() {
		if (!Spicetify.CosmosAPI?.resolver?._bridge?.executeRequest) {
			setTimeout(this.attachCosmosZlink, 100)
			return
		}
		const bridge = Spicetify.CosmosAPI.resolver._bridge
		this.cosmos = bridge.executeRequest
		bridge.executeRequest = this.proxyCosmosZlink
		console.log("[Proxy] Attached Cosmos proxy")
	}

	detachCosmosZlink() {
		Spicetify.CosmosAPI.resolver._bridge.executeRequest = this.cosmos
	}

	attachCosmosXpui() {
		// @ts-ignore
		if (!Spicetify.CosmosAsync?.resolver?.send) {
			setTimeout(this.attachCosmosXpui, 100)
			return
		}
		// @ts-ignore
		const resolver = Spicetify.CosmosAsync.resolver
		this.cosmos = resolver.send
		resolver.send = this.proxyCosmosXpui
		console.log("[Proxy] Attached Cosmos proxy")
	}

	detachCosmosXpui() {
		// @ts-ignore
		Spicetify.CosmosAsync.resolver.send = this.cosmos
	}

	log(
		type: RequestType,
		method: string,
		url: string,
		headers: Record<string, string>,
		body: any,
		response: any
	) {
		console.log(
			type[0].toUpperCase() + type.substring(1),
			"-",
			method,
			url,
			"headers:",
			headers,
			"body:",
			body,
			"response:",
			response
		)
	}

	async proxyFetch(
		input: RequestInfo,
		init?: RequestInit
	): Promise<Response> {
		const method = init?.method
		const url = input.toString()
		const headers = init?.headers as Record<string, string>
		const body = init?.body as any
		const response = await this.fetch(input, init)
		this.log("http", method, url, headers, body, response)
		return response
	}

	proxyCosmosZlink(data: string, { onSuccess, onFailure }) {
		const json = JSON.parse(data)
		const request = json.args[1]

		const method = request?.action
		const url = request?.uri
		const headers = request?.headers
		const body = request?.body ? JSON.parse(request?.body) : null

		const success = (response: any) => {
			const resp = JSON.parse(response)
			const respBody = resp?.body ? JSON.parse(resp?.body) : null
			switch (json.name) {
				case "cosmos_request_create":
					this.log("cosmos", method, url, headers, body, respBody)
					break
				case "cosmos_request_pull":
					this.log("cosmos", "PULL", url, headers, body, respBody)
					break
				case "cosmos_request_cancel":
					// this.log("cosmos", "CANCEL", url, headers, body, respBody)
					break
			}
			onSuccess(response)
		}

		const failure = (response: any) => {
			switch (json.name) {
				case "cosmos_request_create":
					this.log("cosmos", method, url, headers, body, response)
					break
				case "cosmos_request_pull":
					this.log("cosmos", "PULL", url, headers, body, response)
					break
				case "cosmos_request_cancel":
					// this.log("cosmos", "CANCEL", url, headers, body, response)
					break
			}
			onFailure(response)
		}

		return this.cosmos(data, { onSuccess: success, onFailure: failure })
	}

	proxyCosmosXpui(args: any) {
		const { request, persistent, onSuccess, onFailure } = args
		const json = JSON.parse(request)

		const method = json?.method
		const url = json?.uri
		const headers = json?.headers
		const body = json?.body ? JSON.parse(json?.body) : null

		const success = (response: any) => {
			const resp = response ? JSON.parse(response) : null
			this.log("cosmos", method, url, headers, body, resp)
			onSuccess(response)
		}

		const failure = (response: any) => {
			this.log("cosmos", method, url, headers, body, response)
			onFailure(response)
		}

		return this.cosmos({
			request: request,
			persistent: persistent,
			onSuccess: success,
			onFailure: failure,
		})
	}
}
