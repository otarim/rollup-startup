const path = require('path')
module.exports = {
    publicPath: 'assets/',
    output: path.resolve(__dirname, '../public'),
    src: path.resolve(__dirname, '../src'),
    htmlPlugIn: {
        template: path.resolve(__dirname, '../index.ejs'),
        output: path.resolve(__dirname, '../public/index.html')
    }
}