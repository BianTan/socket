const httpServer = require('http').createServer()
const io = require('socket.io')(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://coolaf.com']
  }
})
const md5 = require('md5')
const { v4: uuidv4 } = require('uuid')

const userMap = new Map()

// 中间件
io.use((socket, next) => {
  const { session } = socket.handshake.auth
  if (session) {
    const user = userMap.get(session)
    if (user) {
      socket.user = { ...user }
      socket.sessionID = session
      socket.join('main')
      return next()
    }
  }
  const { nickname, email = ''  } = socket.handshake.auth
  if (!nickname) {
    return next(new Error("用户昵称不能为空"))
  }
  const avatar = email ? `https://www.gravatar.com/avatar/${md5(email)}?s=64` : ''
  const sessionID = uuidv4()
  const user = {
    uid: uuidv4(),
    nickname,
    avatar
  }
  userMap.set(sessionID, user)
  socket.user = { ...user }
  socket.sessionID = sessionID
  socket.join('main')
  next()
})

io.on('connection', (socket) => {
  const users = Array.from(userMap.values())

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

  socket.broadcast.emit('user connected', {
    ...socket.user,
    connected: true,
  })

  socket.on('message', ({ type, msg, to }) => {
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
