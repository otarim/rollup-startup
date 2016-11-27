var rollup = require('rollup').rollup
var babel = require('rollup-plugin-babel')
var resolve = require('rollup-plugin-node-resolve')
var commonjs = require('rollup-plugin-commonjs')
var replace = require('rollup-plugin-replace')
var uglify = require('rollup-plugin-uglify')
var less = require('rollup-plugin-less')
var url = require('rollup-plugin-url')
var watch = require('node-watch')
var LessAutoprefix = require('less-plugin-autoprefix')
var string = require('rollup-plugin-string')

const ENV = process.env.NODE_ENV || 'development'
const urlPlugIn = url({
    limit: 10 * 1024,
    publicPath: 'dist/'
})
const outputOpt = {
    dest: 'dist/main.js',
    format: 'iife',
    sourceMap: 'inline',
    footer: ENV === 'production' ? false : `document.write(
        '<script src="http://' + (location.host || 'localhost').split(':')[0] +
        ':35729/livereload.js?snipver=1"></' + 'script>'
    );`
}
const LESS_CONF = {
    option: {
        compress: ENV === 'production',
        plugins: [new LessAutoprefix({
            browsers: ['Chrome > 1']
        })]
    }
}
if (ENV === 'production') {
    LESS_CONF.insert = false
    LESS_CONF.output = 'dist/main.css'
} else {
    LESS_CONF.insert = true
    LESS_CONF.output = function(output) {
        return output
    }
}

var build = function() {
    rollup({
        entry: 'src/main.js',
        plugins: [
            less(LESS_CONF),
            resolve({
                jsnext: true,
                main: true,
                browser: true,
            }),
            commonjs(),
            urlPlugIn,
            string({
                include: ['**/*.tpl', '**/*.html']
            }),
            babel({
                exclude: 'node_modules/**',
                presets: ['es2015-rollup'],
                babelrc: false
            }),
            (ENV === 'production' && uglify())
        ]
    }).then(function(bundle) {
        bundle.write(outputOpt)
    }).then(function() {
        urlPlugIn.write(outputOpt)
    })
}

if (ENV === 'development') {
    watch('src/', function(filename) {
        console.log(`${filename} changed, Watching for changes...`)
        build()
    })
}

build()