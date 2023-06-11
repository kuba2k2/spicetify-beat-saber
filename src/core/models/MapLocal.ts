export type MapLocal = {
	levelDir: string
	hash: string

	name: string
	subName: string
	authorName: string
	mapperName: string

	characteristics: Record<string, string[]>

	songFilename: string
	coverFilename: string
}
