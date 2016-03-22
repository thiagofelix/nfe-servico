#!/usr/bin/env node

import http from 'http'
import alloc from 'tcp-bind'
import minimist from 'minimist'
import isRoot from 'is-root'
import compression from 'compression'
import express from 'express'
import { consultar } from 'nfe-biblioteca'

const argv = minimist(process.argv.slice(2), {
  alias: { p: 'port', u: 'uid', g: 'gid' },
  default: { port: isRoot() ? 80 : 8000 }
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

app.get(/nfe/, (req, res) => {
  let link = req.originalUrl.slice(5)
  consultar(link)
    .then(nfe => {
      res.status(200).json(nfe)
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
})

const server = http.createServer(app)
server.listen({fd}, () => {
  console.log('process pid=%d uid=%d gid=%d', process.pid, process.getuid(), process.getgid())
  console.log('listening on: %s', JSON.stringify(server.address()))
})
