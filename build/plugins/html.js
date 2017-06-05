const minify = require('html-minifier').minify,
    util = require('util'),
    fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    ejs = require('ejs')

const DEF_CONF = {
    inject: true, // true | 'head' | 'body' | false
    hashLen: 6
}

var hashEncode = function(input) {
    var hash = crypto.createHash('md5')
    return hash.update(input).digest('hex')
}

var injectRes = function(template, res, type, pos) {
    let len = template.length,
        startPos
    switch(pos) {
        case 'head':
            startPos = template.indexOf('</head>')
            break
        case true:
        case 'body':
            startPos = template.indexOf('</body>') + '</body>'.length
            break
    }
    if (!util.isUndefined(startPos)) {
        template = `
            ${template.slice(0, startPos)}
            ${type === 'js' ? `<script src="${res}"></script>` : `<link rel="stylesheet" href="${res}">`}
            ${template.slice(startPos, len)}
        ` 
    }
    return template
}

module.exports = function(opt = {}) {
    opt = Object.assign({}, DEF_CONF, opt)
    return {
        name: 'html-plugin',
        onwrite(config, data) {
            if (!opt.template) return
            if (!opt.output) return
            var template = fs.readFileSync(opt.template).toString()
            if (opt.inject) {
                let dest = config.dest
                if (dest.indexOf('[hash]') !== -1) {
                    fs.unlinkSync(dest)
                    let hash = hashEncode(data.code).slice(0, opt.hashLen)
                    dest = dest.replace('[hash]', hash)
                    fs.writeFileSync(dest, data.code)
                }
                dest = dest.replace(opt.dest, '')
                template = injectRes(template, dest, 'js', opt.inject)
            }
            if (opt.injection) {
                opt.injection = [].concat(opt.injection)
                // js 继承 inject 选项
                // css 默认注入到 head
                opt.injection.forEach(function(inject) {
                    var ext = path.extname(inject)
                    var pos = ext === '.css' ? 'head' : opt.inject
                    template = injectRes(template, inject, ext.slice(1), pos)
                })
            }
            let ext = path.extname(opt.template)
            if (ext === '.ejs') {
                template = ejs.render(template, {
                    htmlRollupPlugIn: opt,
                    ROLLUPCONF: config
                }, opt.ejs)
            }
            if (opt.minify && util.isObject(opt.minify)) {
                template = minify(template, opt.minify)
            }
            fs.writeFileSync(opt.output, template)
        }
    }
}