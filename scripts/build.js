const fs = require('fs')
const browserify = require('browserify')
const tsify = require('tsify')

browserify({
	debug: false,
})
	.add('src/main.ts')
	.plugin(tsify)
	.plugin('tinyify')
	.transform("babelify", {
		presets: ["@babel/preset-typescript", "@babel/preset-react"],
		extensions: [".tsx", ".ts"],
	})
	.bundle()
	.pipe(fs.createWriteStream('apps/beatsaber/beatsaber.bundle.js'))
