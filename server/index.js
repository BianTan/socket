const httpServer = require('http').createServer()
const io = require('socket.io')(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://coolaf.com']
  },
  serveClient: false
})
const md5 = require('md5')
const { v4: uuidv4 } = require('uuid')
const { ErrorReturn } = require('./utils')
const { UserSessionStore, MessageSessionStore } = require('./sessonStore')

// 注册用户
const userStore = new UserSessionStore()
// 服务器储存的消息
const msgStore = new MessageSessionStore()

// 中间件
io.use((socket, next) => {
  const { session, nickname } = socket.handshake.auth
  if (session) {
    const user = userStore.find(session)
    if (user) {
      socket.user = user
      socket.sessionID = session
      // 更新用户状态
      userStore.save(socket.sessionID, { connected: true })
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
  const avatar = `https://gravatar.loli.net/avatar/${md5(email)}?s=64`
  const sessionID = uuidv4()
  // 用户信息
  const user = {
    uid: uuidv4(),
    nickname,
    avatar,
    connected: true,
    email
  }
  userStore.save(sessionID, user)
  socket.user = { ...user }
  socket.sessionID = sessionID
  // 加入大厅和自己私聊
  socket.join(['main', user.uid])
  next()
})

io.on('connection', (socket) => {
  console.log(socket.id)
  const users = userStore.findAll()

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
    ],
    message: msgStore.find(socket.user.uid)
  })
  
  socket.emit('加入的房间', [...socket.rooms])

  // 用户连接
  socket.broadcast.emit('user connected', {
    ...socket.user,
    connected: true,
  })
  // 用户断开连接
  socket.on('disconnect', async () => {
    // 搜索包含所有当前用户 ID 的连接
    const matchingSockets = await io.in(socket.user.uid).allSockets()
    // 判断是否当前用户的所有登录都已退出
    const isDisconnected = matchingSockets.size === 0
    // 还有连接则直接 return 不做处理
    if (!isDisconnected) return
    // 否则已经全部退出了
    // 给除了自己的所有人发送下线通知
    socket.broadcast.emit('user disconnected', {
      uid: socket.user.uid
    })
    // 并且更新用户状态 - 离线
    userStore.save(socket.sessionID, { connected: false })
  })

  // 发送消息
  socket.on('message', ({ type, msg, to }) => {
    // 空消息不做处理
    if (!msg.trim()) return
    const { uid } = socket.user
    const message = {
      msg,
      from: uid,
      to: type === 1 ? 'main' : to,
      date: new Date().getTime()
    }
    // 发送信息
    type === 1
      ? socket.to('main').emit('message', message)
      : socket.to(to).to(socket.user.uid).emit('message', message)
    // 储存至本地
    msgStore.save(message)
    console.log('message', message)
  })
})

httpServer.listen(9527, () => {
  console.log('listening on *:9527')
})
