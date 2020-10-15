const http = require('http')
const { portOccupied } = require('../portOccupied')

const never = ()=> {}

const startServer = (port, retry) => {
    portOccupied(port, function callback(error, idePort){
        if(error){
            if (retry <= 0) {
                throw error
            }

            return startServer(idePort + 1, retry--)
        }

        const server = http.createServer(never)

        server.listen(idePort)
        console.log('\n Test Server running at: ')
        console.log(` http://localhost:${idePort}\n`)
    })
}

startServer(3000, 50)