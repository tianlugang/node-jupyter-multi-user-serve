const express = require('express')
const bodyParser = require('body-parser')
const utils = require('./lib/utils')
const jLab = require('./jupyter/index')
const resUtil = require('./lib/resUtil')

const staticDir = utils.resolveByAppRoot('./static')
const viewsDir = utils.resolveByAppRoot('./views')

const staticServer = express.static(staticDir, {
  cacheControl: true,
  etag: true,
  lastModified: true,
  index: ['index']
})

// mount `jupyterProxy` in web server
const app = express()

app.set('views', viewsDir)
app.set('view engine', 'ejs')
app.set('view cache', true)

app.use('/static',staticServer)
// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
// 返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/jupyter', (req,res,next)=>{
  // create the proxy (without context)
  const url = req.url
  const port = url.split('/')[1]
  const jupyterProxy = jLab.proxy(port, jLab.prefix)

  jupyterProxy(req, res, next)
})
app.get('/index', (req, res) => {
  res.render('index', { title: 'index'})
})
app.get('/setup', (req, res) => {
  res.render('setup', { title: 'setup'})
})
app.post('/j-lab/start', (req,res, next) => {
  const uuid = req.body.uuid

  if (uuid != null) {
    return jLab.start(uuid, jLab.prefix).then(opts => {
      resUtil.reply(res, 1, opts)
    }).catch(err => {

      resUtil.reply(res, 1002, err)
      throw err
    })
  }

  // 缺少参数
  resUtil.reply(res, 1001)
  next()
})
app.post('/j-lab/stop', (req,res) => {
  const uuid = req.body.uuid

  if (uuid != null) {
    return jLab.stop(uuid, jLab.prefix).then(opts => {
      resUtil.reply(res, 1, opts)
    }).catch(err => {
      resUtil.reply(res, 1003, err)
    })
  }

  // 缺少参数
  resUtil.reply(res, 1001)
  next()
})
app.post('/j-lab/restart', (req,res)=> {
  const uuid = req.body.uuid

  if (uuid != null) {
    return jLab.restart(uuid, jLab.prefix).then(opts => {
      resUtil.reply(res, 1, opts)
    }).catch(err => {
      resUtil.reply(res, 1004, err)
    })
  }

  // 缺少参数
  resUtil.reply(res, 1001)
  next()
})
app.post('/j-lab/status', (req,res)=> {
  const uuid = req.body.uuid

  if (uuid != null) {
    return jLab.status(uuid, jLab.prefix).then(alive => {
      resUtil.reply(res, 1, {
        alive
      })
    }).catch(err => {
      resUtil.reply(res, 1005, err)
    })
  }

  // 缺少参数
  resUtil.reply(res, 1001)
  next()
})

app.listen(3006)
console.log('server listen on http://localhost:3006')
