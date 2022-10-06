
const { UserSessionStore, MessageSessionStore } = require('./utils/sessonStore')

// 端口
const PORT = 9527
// 注册用户
const userStore = new UserSessionStore()
// 服务器储存的消息
const msgStore = new MessageSessionStore()

module.exports = {
  PORT,
  userStore,
  msgStore
}
