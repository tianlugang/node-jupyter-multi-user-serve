const { createProxyMiddleware } = require('http-proxy-middleware')
const jLab = require('./utils/jLab')
const stat = require('./utils/stat')

const proxyCache = new Map()

exports.prefix = 'jupyter'

exports.proxy = (port, prefix) => {
    if (proxyCache.has(port)) {
        return proxyCache.get(port)
    }

    const proxyMiddleware = createProxyMiddleware({
        target: `http://localhost:${port}`, // target host
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          // '^/api/old-path': '/api/new-path', // rewrite path
        },
    })

    proxyCache.set(port, proxyMiddleware)

    return proxyMiddleware
}

exports.start = (uuid, prefix) => {

    return new Promise((resolve, reject) => {
        stat.getOption(uuid, prefix).then(option => {
            jLab.check(option.pidFile).then(() => resolve(option)).catch(() => {
                jLab.start(option).then(resolve).catch(reject)
            }).catch(reject)
        }).catch(reject)
    })
}

exports.stop = (uuid, prefix) => {
    return new Promise((resolve, reject)=> {
        stat.getOption(uuid, prefix).then(option => {
            jLab.check(option.pidFile).then(pid =>{
                jLab.stop(pid).then(() => resolve(option)).catch(reject)
            }).catch(reject)
        }).catch(reject)
    })
}

exports.restart = (uuid, prefix) => {
    return new Promise((resolve, reject) => {
        stat.getOption(uuid, prefix).then(option => {
            jLab.check(option.pidFile).then(pid =>{
                jLab.stop(pid).then(() => {
                    jLab.start(option).then(resolve).catch(reject)
                }).catch(reject)
            }).catch(reject)
        }).catch(reject)
    })
}

exports.status = (uuid, prefix) => {
    return new Promise((resolve, reject) => {
        stat.getOption(uuid, prefix).then(option => {
            jLab.check(option.pidFile).then(pid => {
                if (typeof pid === 'number') {
                    return resolve(true)
                }

                throw new Error('Not Running.')
            }).catch(reject)
        }).catch(reject)
    })
}

module.exports = exports
