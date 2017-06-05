const rollup = require('rollup').rollup
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const less = require('rollup-plugin-less')
const url = require('rollup-plugin-url')
const watch = require('node-watch')
const LessAutoprefix = require('less-plugin-autoprefix')
const string = require('rollup-plugin-string')
const htmlPlugIn = require('../plugins/html')
const path = require('path')
const fs = require('fs')
const vars = require('../var')
const util = require('../util')

const PUBLICPATH = vars.publicPath
const OUTPUTPATH = path.resolve(vars.output, PUBLICPATH)

const urlPlugIn = url({
    limit: 10 * 1024,
    publicPath: PUBLICPATH
})

const outputOpt = {
    dest: path.resolve(OUTPUTPATH, 'main.js'),
    format: 'iife',
    sourceMap: 'inline',
    footer: `document.write(
        '<script src="http://' + (location.host || 'localhost').split(':')[0] +
        ':35729/livereload.js?snipver=1"></' + 'script>'
    );`
}
const PublicOpt = {
    dest: `${OUTPUTPATH}/??`
}
const LESS_CONF = {
    insert: true,
    output: function(output) {
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
            htmlPlugIn({
                output: vars.htmlPlugIn.output,
                template: vars.htmlPlugIn.template,
                dest: vars.output,
                publicPath: PUBLICPATH,
                title: 'hello world',
                inject: true,
                ejs: {}
            })
        ]
    }).then(function(bundle) {
        bundle.write(outputOpt)
    }).then(function() {
        urlPlugIn.write(PublicOpt)
    })
}

watch(vars.src, function(filename) {
    console.log(`${filename} changed, Watching for changes...`)
    build()
})

util.mkdirSync(OUTPUTPATH)
build()