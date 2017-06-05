const path = require('path')
const fs = require('fs')

function mergeDeep(target, ...sources) {
    if (!sources.length) return target
    const source = sources.shift()
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                    mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}

exports.mergeDeep = mergeDeep

function mkdirSync(dir) {
    var dirs = dir.split('/'),
        dirname = '/'
    while(true) {
        if (dirs.length) {
            dirname = path.resolve(dirname, dirs.shift())
            try {
                fs.accessSync(dirname)
            } catch (err) {
                fs.mkdirSync(dirname)
            }
        } else {
            break
        }
    }
}

exports.mkdirSync = mkdirSync