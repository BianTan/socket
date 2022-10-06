const httpServer = require('http').createServer()
const io = require('socket.io')(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://coolaf.com']
  },
  serveClient: false
})
const md5 = require('md5')
const { v4: uuidv4 } = require('uuid')

// 注册用户
const userMap = new Map()
// 错误返回
const ErrorReturn = (payload) => {
  if (typeof payload === 'string') {
    return new Error(JSON.stringify({
      code: 1000,
      error: payload
    }))
  } else {
    const { code, msg } = payload
    return new Error(JSON.stringify({
      code,
      error: msg
    }))
  }
}

// 中间件
io.use((socket, next) => {
  const { session, nickname } = socket.handshake.auth
  if (session) {
    const user = userMap.get(session)
    if (user) {
      socket.user = { ...user }
      socket.sessionID = session
      // 更新用户状态
      userMap.set(socket.sessionID, {
        ...socket.user,
        connected: true
      })
      // 加入大厅和自己私聊
      socket.join(['main', user.uid])
      return next()
    } else {
      return next(ErrorReturn({
        code: 1001,
        msg: '登录失效'
      }))
    }
  }
  const { email = ''  } = socket.handshake.auth
  if (!nickname) {
    return next(ErrorReturn('用户昵称不能为空'))
  }
  // const avatar = email ? `https://www.gravatar.com/avatar/${md5(email)}?s=64` : ''
  // 使用 CDN 加速头像
  const avatar = `https://cdn.v2ex.com/gravatar/${md5(email)}?s=64`
  const sessionID = uuidv4()
  // 用户信息
  const user = {
    uid: uuidv4(),
    nickname,
    avatar,
    connected: true,
    email
  }
  userMap.set(sessionID, { ...user })
  socket.user = { ...user }
  socket.sessionID = sessionID
  // 加入大厅和自己私聊
  socket.join(['main', user.uid])
  next()
})

io.on('connection', (socket) => {
  console.log(socket.id)
  const users = Array.from(userMap.values())

  // 登录
  socket.emit('login', {
    session: socket.sessionID,
    info: socket.user,
    users,
    rooms: [
      {
        name: '公共大厅',
        img: socket.user.avatar,
        id: 'main'
      }
    ]
  })
  
  socket.emit('加入的房间', [...socket.rooms])

  // 用户连接
  socket.broadcast.emit('user connected', {
    ...socket.user,
    connected: true,
  })
  // 用户断开连接
  socket.on('disconnect', async () => {
    const matchingSockets = await io.in(socket.userID).allSockets()
    const isDisconnected = matchingSockets.size === 0
    if (!isDisconnected) return
    // 给除了自己的人发送下线通知
    socket.broadcast.emit('user disconnected', {
      uid: socket.user.uid
    })
    // 更新用户状态
    userMap.set(socket.sessionID, {
      ...socket.user,
      connected: false
    })
  })

  // 发送消息
  socket.on('message', ({ type, msg, to }) => {
    // 空消息不做处理
    if (!msg.trim()) return
    const { uid } = socket.user
    if (type === 1) {
      socket.to('main').emit('message', {
        msg,
        from: uid,
        to: 'main'
      })
    } else {
      socket.to(to).to(socket.user.uid).emit('message', {
        msg,
        from: uid,
        to
      })
    }
  })
})

httpServer.listen(9527, () => {
  console.log('listening on *:9527')
})
