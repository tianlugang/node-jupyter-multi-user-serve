const fs = require('fs-extra')
const { execCommand } = require('./execCommand')
const { portOccupied } = require('./portOccupied')
const stat = require('./stat')

const runJLab = async ({ port, config, baseDir, fileDir, logFile, pidFile, prefix }) => {
    try {
        await fs.mkdirp(baseDir)
        await fs.mkdirp(fileDir)

        const startScript = [
            '#!/usr/bin/bash\n',
            'nohup jupyter lab',
            `--config ${config}`,
            `--port ${port}`,
            `--port-retries 0`,
            `--notebook-dir ${fileDir}`,
            `--NotebookApp.base_url=/${prefix}/${port}`,
            `>>${logFile} 2>&1 & \n`, // /dev/null 2>
            `echo $! > ${pidFile}\n`
        ].join(' ')

        await execCommand(startScript)
    } catch (error) {
        throw error
    }
}

const startJLab = (option) => {
    return new Promise((resolve, reject)=>{
        const onceCallback = async error =>{
            if(error){
                if (option.retry <= 0) {
                    return reject(error)
                }

                option.port += 1
                option.retry -= 1
                return tryStartJLab(option)
            }

            try {
                await runJLab(option)
                await stat.generate(option)
                resolve(option)
            } catch (error) {
                reject(error)
            }
        }

        const tryStartJLab = option => {
            portOccupied(option.port, onceCallback)
        }

        tryStartJLab(option)
    })
}

const checkJLab = pidFile => {
    return new Promise((resolve, reject)=> {
        stat.getPid(pidFile).then(pid=> {
            const checkScript = [
                '#!/usr/bin/bash\n',
                `tasks=$(ps -p ${pid} | grep -v "PID TTY" | wc -l)\n`,
                `echo $tasks`
            ].join(' ')

            execCommand(checkScript).then(({stdout, stderr})=>{
                console.log('check-stdout', stdout)
                console.log('check-stderr', stderr)

                if (stdout <= 0 || stderr) {
                    return reject(new Error('Not Running.' || stderr))
                }

                resolve(pid)
            }).catch(reject)
        }).catch(reject)
    })
}

const stopJLab = pid => {
    return execCommand(`kill -9 ${pid}`).then(({stdout, stderr})=>{
        console.log('stop-stdout', stdout)
        console.log('stop-stderr', stderr)

        if (stderr) {
            throw new Error(stderr)
        }

        return stdout
    })
}

module.exports = {
    check: checkJLab,
    start: startJLab,
    stop: stopJLab,
}
