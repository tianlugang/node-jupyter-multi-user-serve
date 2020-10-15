const path = require('path')
const fs = require('fs-extra')
const { rmInvalidCharacter } = require('./rmInvalidCharacter')

const workBaseDir = path.resolve(__dirname, '../workspaces')
const statFilePath = path.resolve(__dirname, '../data/jlab_stat.json')
const jLabConfigPath = path.resolve(__dirname, '../data/jlab_config.py')
const resolveByWorkBaseDir = (...args) => path.join(workBaseDir, ...args)
const getPort = (stats, uuid) => {
    if (!stats) return
    if (!stats.servers) return stats.port
    if (stats.servers[uuid]) return stats.servers[uuid].port
}
const stat = {
    generate(option) {
        return new Promise((resolve, reject) =>{
            stat.getPid(option.pidFile).then(pid =>{
                stat.getJSON().then(stats => {
                    const newStats = Object.assign(stats, {
                        port: option.port,
                        servers: {
                            [option.uuid]: {
                                pid: pid,
                                port: option.port,
                                uuid: option.uuid
                            }
                        }
                    })

                    fs.writeJSON(statFilePath , newStats).then(resolve).catch(reject)
                })
            }).catch(reject)
        })
    },

    getPid(pidFile) {
        return new Promise((resolve, reject)=> {
            fs.readFile(pidFile, (err, data)=> {
                if (err) return reject(err)
                const pid = rmInvalidCharacter(data.toString())
                resolve(pid)
            })
        })
    },

    getJSON() {
        return fs.readJSON(statFilePath, { encoding: 'utf8' })
    },

    getOption(uuid, prefix) {
        uuid = rmInvalidCharacter(uuid)
        const option = {
            uuid,
            prefix,
            port: 3000,
            retry: 50,
            config: jLabConfigPath,
            baseDir: resolveByWorkBaseDir(uuid),
            logFile: resolveByWorkBaseDir(`${uuid}/lab.log`),
            fileDir: resolveByWorkBaseDir(`${uuid}/files`),
            pidFile: resolveByWorkBaseDir(`${uuid}/lab.pid`),
        }

        return new Promise((resolve, reject) => {
            stat.getJSON(uuid).then(stats => {
                option.port = getPort(stats, uuid) || option.port
                resolve(option)
            }).catch(reject)
        })
    }
}

module.exports = stat