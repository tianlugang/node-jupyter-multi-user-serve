const util = require('util')
const { exec } = require('child_process')

module.exports.execCommand = util.promisify(exec)