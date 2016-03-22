#!/usr/bin/env node

import http from 'http'
import alloc from 'tcp-bind'
import minimist from 'minimist'
import isRoot from 'is-root'

const argv = minimist(process.argv.slice(2), {
  alias: { p: 'port', u: 'uid', g: 'gid' },
  default: { port: isRoot() ? 80 : 8000 }
})

const fd = alloc(argv.port)

if (argv.gid) process.setgid(argv.gid)
if (argv.uid) process.setuid(argv.uid)

const server = http.createServer((req, res) => {
  console.log('%d request received', process.pid)
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('Hello world!\n')
})

server.listen({fd}, () => {
  console.log(argv)
  console.log('process pid=%d uid=%d gid=%d', process.pid, process.getuid(), process.getgid())
  console.log('listening on: %s', JSON.stringify(server.address()))
})

