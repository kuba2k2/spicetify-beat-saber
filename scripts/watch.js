const fs = require('fs')
const browserify = require('browserify')
const watchify = require('watchify')
const tsify = require('tsify')

const b = browserify({
    cache: {},
    packageCache: {},
    debug: true,
})
    .add('src/main.ts')
    .plugin(tsify)
    .transform("babelify", {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
        extensions: [".tsx", ".ts"],
    })
    .plugin(watchify)
    .on('update', bundle)
    .on('log', (msg) => {
        console.info(msg)
    })

bundle()

function bundle() {
    console.log('Compiling...')
    b.bundle()
        .on('error', console.error)
        .pipe(fs.createWriteStream('apps/beatsaber/beatsaber.bundle.js'))
}
