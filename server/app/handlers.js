const { userStore, msgStore } = require('./global')

const connectionSetup = (socket) => {
  console.log(socket.id)
  const users = userStore.findAll()
  console.log('users', users)

  // 登录
  const message = msgStore.find(socket.user.uid)
  const msgKey = Object.keys(message)
  socket.emit('login', {
    session: socket.sessionID,
    info: socket.user,
    users,
    rooms: msgKey.length
      ? msgKey.map(key => {
        const info = users.find(f => f.uid === key)
        return {
          name: info?.nickname || '公共大厅',
          img: info?.avatar || socket.user.avatar,
          id: key || 'main'
        }
      })
      : [
        {
          name: '公共大厅',
          img: socket.user.avatar,
          id: 'main'
        }
      ],
    message,
  })

  // 用户连接
  socket.broadcast.emit('user connected', {
    ...socket.user,
    connected: true,
  })
}

const userDisconnect = (io, socket) => {
  return async () => {
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
  }
}

const onMessage = (socket) => {
  return ({ type, msg, to }) => {
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
  }
}

module.exports = {
  connectionSetup,
  userDisconnect,
  onMessage
}
