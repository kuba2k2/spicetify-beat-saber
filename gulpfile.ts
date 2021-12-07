import gulp from "gulp"
import sourcemaps from "gulp-sourcemaps"
import concat from "gulp-concat"
import { BrowserifyObject } from "browserify"
import uglify from "gulp-uglify"
import rename from "gulp-rename"
import gulpIf from "gulp-if"
import bro from "gulp-bro"
const sass = require("gulp-sass")(require("sass"))

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
	return gulp
		.src(src || ["src/main.ts", "src/loader.ts", "src/shim.ts"])
		.pipe(
			bro({
				debug: debug,
				cacheFile: "browserify-cache.json",
				plugin: [[tsifyBabelify, { debug }]],
			})
		)
		.pipe(gulpIf(debug, sourcemaps.init({ loadMaps: true })))
		.pipe(gulpIf(!debug, uglify()))
		.pipe(
			rename((opt) => {
				opt.basename =
					"beatsaber." + opt.basename.replace("main", "bundle")
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
		if (!file.endsWith("loader.ts") && !file.endsWith("shim.ts")) {
			file = "src/main.ts"
		}
		const task = js.bind(this, true, file)
		task.displayName = file
		gulp.series(task)(null)
	})
})

gulp.task("build", gulp.parallel("css", "js"))
gulp.task("build:dev", gulp.parallel("css:dev", "js:dev"))
gulp.task("watch", gulp.parallel("css:watch", "js:watch"))
