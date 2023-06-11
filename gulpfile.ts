import gulp from "gulp"
import sourcemaps from "gulp-sourcemaps"
import concat from "gulp-concat"
import { BrowserifyObject } from "browserify"
import uglify from "gulp-uglify"
import rename from "gulp-rename"
import gulpIf from "gulp-if"
import bro from "gulp-bro"
import transform from "gulp-transform"
import { File } from "gulp-util"
const sass = require("gulp-sass")(require("sass"))

const globals = {
	"react": "Spicetify.React",
	"react-dom": "Spicetify.ReactDOM",
}

function tsifyBabelify(b: BrowserifyObject, opts: { debug: boolean }) {
	b.plugin("tsify")
	b.transform("babelify", {
		presets: ["@babel/preset-typescript", "@babel/preset-react"],
		extensions: [".ts", ".tsx"],
		sourceMaps: opts.debug,
	})
}

function css(debug?: boolean) {
	return gulp
		.src("src/scss/style.scss")
		.pipe(gulpIf(debug, sourcemaps.init()))
		.pipe(
			sass
				.sync({ outputStyle: debug ? "expanded" : "compressed" })
				.on("error", sass.logError)
		)
		.pipe(concat("beatsaber.css"))
		.pipe(gulpIf(debug, sourcemaps.write(".")))
		.pipe(gulp.dest("apps/beatsaber/css/"))
}

function resCopy() {
	return gulp.src("res/*.css").pipe(gulp.dest("apps/beatsaber/css/"))
}

function js(debug?: boolean, src?: string) {
	function rewriteRequire(contents: string, file: File) {
		for (const global in globals) {
			// @ts-ignore
			contents = contents.replaceAll(`require("${global}")`, globals[global])
			// @ts-ignore
			contents = contents.replaceAll(`require('${global}')`, globals[global])
		}
		// make shim-xpui export the render() function
		if (file.basename == "shim-xpui.ts") {
			contents = "const renderRequire=" + contents
			contents += "const render = renderRequire(1).default;"
		}
		return contents
	}

	const sources = {
		"main": "beatsaber.bundle",
		"loader": "beatsaber.loader",
		"shim-zlink": "beatsaber.shim",
		"shim-xpui": "index",
	}

	return gulp
		.src(src || Object.keys(sources).map((s) => `src/${s}.ts`))
		.pipe(
			bro({
				debug: debug,
				cacheFile: "browserify-cache.json",
				plugin: [[tsifyBabelify, { debug }]],
				external: Object.keys(globals),
			})
		)
		.pipe(gulpIf(debug, sourcemaps.init({ loadMaps: true })))
		.pipe(transform("utf8", rewriteRequire))
		.pipe(gulpIf(!debug, uglify()))
		.pipe(
			rename((opt) => {
				opt.basename = sources[opt.basename]
				opt.extname = ".js"
			})
		)
		.pipe(gulpIf(debug, sourcemaps.write(".")))
		.pipe(gulp.dest("apps/beatsaber/"))
}

gulp.task("css", () => {
	resCopy()
	return css(false)
})

gulp.task("css:dev", () => {
	resCopy()
	return css(true)
})

gulp.task("css:watch", () => {
	return gulp.watch(
		["src/scss/**/*.scss", "res/*.css"],
		{ ignoreInitial: false },
		gulp.task("css:dev")
	)
})

gulp.task("js", () => {
	return js(false)
})

gulp.task("js:dev", () => {
	return js(true)
})

gulp.task("js:watch", () => {
	gulp.series(gulp.task("js:dev"))(null)
	return gulp.watch(["src/**/*.ts", "src/**/*.tsx"]).on("change", (file) => {
		if (!file.endsWith("loader.ts") && !file.includes("shim-")) {
			file = "src/main.ts"
		}
		// apparently it does not understand backslashes properly
		file = file.replace("\\", "/")
		const task = js.bind(this, true, file)
		task.displayName = file
		gulp.series(task)(null)
	})
})

gulp.task("build", gulp.parallel("css", "js"))
gulp.task("build:dev", gulp.parallel("css:dev", "js:dev"))
gulp.task("watch", gulp.parallel("css:watch", "js:watch"))
