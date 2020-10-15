const net = require('net')
const { once } = require('./once')

class PortOccupiedError extends Error {
    constructor (port) {
        this.message = `${port} is already occupied.`
        this.code = 'EADDRINUSE'
    }
}

const portOccupied =  (port, callback) => {
    const server = net.createServer().listen(port)
    const fireCallback = once((err)=>{
        timeoutRef && clearTimeout(timeoutRef)
        server && server.close()
        callback(err, port)
    })
    const onTimeout = () => {
        fireCallback(new PortOccupiedError(port))
    }
    const onListening = () => {
        fireCallback(null)
    }
    const onError = err => {
        fireCallback(err.code === 'EADDRINUSE' ? err : null)
    }
    const timeoutRef = setTimeout(onTimeout, 2000)

    timeoutRef.unref()
    server.on('listening',onListening)
    server.on('error', onError)
}

module.exports.portOccupied = portOccupied