declare namespace Spicetify {
	const LiveAPI: any

	namespace BridgeAPI {
		function request(
			message: string,
			args?: any,
			callback?: (error?: object, result?: object) => void
		): void
	}

	/**
	 * Async wrappers of BridgeAPI
	 */
	namespace BridgeAsync {
		function request(message: string, args?: any): Promise<object>
	}

	const CosmosAPI: any

	/**
	 * Async wrappers of CosmosAPI
	 */
	namespace CosmosAsync {
		type Action = "DELETE" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "SUB"
		interface Error {
			code: number
			error: string
			message: string
		}

		interface Response {
			body: any
			headers: object
			status: number
			uri: string
		}

		function head(url: string, headers?: object): Promise<object>

		function get(url: string, body?: any, headers?: object): Promise<object>

		function post(
			url: string,
			body?: any,
			headers?: object
		): Promise<object>

		function put(url: string, body?: any, headers?: object): Promise<object>

		function del(url: string, body?: any, headers?: object): Promise<object>

		function patch(
			url: string,
			body?: any,
			headers?: object
		): Promise<object>

		function sub(
			url: string,
			callback: (b: Response) => void,
			onError?: (e: Error) => void,
			body?: any,
			headers?: object
		): Promise<object>

		function postSub(
			url: string,
			body: any,
			callback: (b: Response) => void,
			onError?: (e: Error) => void
		): Promise<object>

		function request(
			method: Action,
			url: string,
			body?: any,
			headers?: object
		): Promise<object>

		function resolve(
			method: Action,
			url: string,
			body?: any,
			headers?: object
		): Promise<object>
	}
}
