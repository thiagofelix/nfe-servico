#!/usr/bin/env node

import https from 'https'
import alloc from 'tcp-bind'
import minimist from 'minimist'
import isRoot from 'is-root'
import compression from 'compression'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { consultar } from 'nfe-biblioteca'

const argv = minimist(process.argv.slice(2), {
  alias: { p: 'port', u: 'uid', g: 'gid' },
  default: { port: isRoot() ? 443 : 8000 }
})

const fd = alloc(argv.port)

if (argv.gid) {
  process.setgid(argv.gid)
}
if (argv.uid) {
  process.setuid(argv.uid)
}

const app = express()
app.use(compression())

app.get('/', (req, res) => {
  res.status(200).send('Running Successfully')
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://nossanota.surge.sh')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get(/nfe/, (req, res) => {
  let link = req.originalUrl.slice(5)
  consultar(link)
    .then(nfe => res.status(200).json(nfe))
    .catch(error => res.status(500).json({error}))
})

const options = {
  key: fs.readFileSync(path.join('deploy', 'key.pem')),
  cert: fs.readFileSync(path.join('deploy', 'cert.pem'))
}
const server = https.createServer(options, app)
server.listen({fd}, () => {
  console.log('process pid=%d uid=%d gid=%d', process.pid, process.getuid(), process.getgid())
  console.log('listening on: %s', JSON.stringify(server.address()))
})
