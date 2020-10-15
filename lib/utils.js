const path = require('path')

exports.appRootPath = path.resolve(__dirname, '../')

exports.resolveByAppRoot = (...args) => {
    return path.resolve(exports.appRootPath, ...args)
}

module.exports = exports