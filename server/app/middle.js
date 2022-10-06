const { userStore } = require('./global')
const { ErrorReturn } = require('./utils')
const { v4: uuidv4 } = require('uuid')
const md5 = require('md5')

const useLoginMiddle = (socket, next) => {
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
}

module.exports = {
  useLoginMiddle
}
