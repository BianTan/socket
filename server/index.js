const express = require('express')()
const { createServer } = require('http')
const httpServer = createServer(express)

const { createApplication, PORT } = require('./app')

createApplication(httpServer, {
  cors: {
    origin: ['http://localhost:5173']
  },
})

httpServer.listen(PORT, () => {
  console.log('listening on *:9527')
})
