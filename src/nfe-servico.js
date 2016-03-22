#!/usr/bin/env node

import http from 'http'

const port = process.env.PORT || 3000

http.createServer((req, res) => {
  console.log('%d request received', process.pid)
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('Hello world!\n')
}).listen(port)

console.log('%d listening on %d', process.pid, port)

