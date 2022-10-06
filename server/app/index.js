const {
  connectionSetup,
  userDisconnect,
  onMessage
} = require('./handlers')
const { useLoginMiddle } = require('./middle')
const { Server } = require('socket.io')
const { PORT } = require('./global')

const createApplication = (httpServer, serverOptions = {}) => {
  const io = new Server(httpServer, serverOptions)

  // 中间件 - 登录注册
  io.use(useLoginMiddle)

  // 用户连接
  io.on('connection', (socket) => {
    connectionSetup(socket)
    // 用户断开连接
    socket.on('disconnect', userDisconnect(io, socket))
    // 发送消息
    socket.on('message', onMessage(socket))
  })
  
  return io
}

module.exports = {
  PORT,
  createApplication
}
