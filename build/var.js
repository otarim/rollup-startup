const path = require('path')
var vars = {
    publicPath: 'assets/',
    output: path.resolve(__dirname, '../public'),
    src: path.resolve(__dirname, '../src'),
    htmlPlugIn: {
        template: path.resolve(__dirname, '../index.ejs'),
        output: path.resolve(__dirname, '../public/index.html')
    }
}

vars.liveServer = {
    port: 8181,
    root: vars.output,
    open: true,
    wait: 1000
}

module.exports = vars