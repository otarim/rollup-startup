const rollup = require('rollup').rollup
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')
const less = require('rollup-plugin-less')
const url = require('rollup-plugin-url')
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
    dest: path.resolve(OUTPUTPATH, 'main.[hash].js'),
    format: 'iife',
    sourceMap: false
}

const PublicOpt = {
    dest: `${OUTPUTPATH}/??`
}
const LESS_CONF = {
    option: {
        compress: true,
        plugins: [new LessAutoprefix({
            browsers: ['Chrome > 1']
        })]
    },
    insert: false,
    output: path.resolve(OUTPUTPATH, 'main.css')
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
            uglify(),
            htmlPlugIn({
                output: vars.htmlPlugIn.output,
                template: vars.htmlPlugIn.template,
                dest: vars.output,
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: false
                    // more options:
                    // https://github.com/kangax/html-minifier#options-quick-reference
                },
                ejs: {},
                injection: [
                    `/${PUBLICPATH}main.css`
                ]
            })
        ]
    }).then(function(bundle) {
        bundle.write(outputOpt)
    }).then(function() {
        urlPlugIn.write(PublicOpt)
    })
}

console.log('building....')
util.mkdirSync(OUTPUTPATH)
build()