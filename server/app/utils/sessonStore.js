const deepcopy = require('deepcopy')

/* abstract */ class SessionStore {
  find(id) {}
  save(id, session) {}
  findAll() {}
}

class UserSessionStore extends SessionStore {
  constructor() {
    super()
    this.userMap = new Map()
  }
  
  find(sId) {
    return deepcopy(this.userMap.get(sId))
  }

  save(sId, data, merge = true) {
    const temp = deepcopy(data)
    const userData = merge ? (this.find(sId) || {}) : {}
    Object.assign(userData, temp)
    this.userMap.set(sId, userData)
  }

  findAll() {
    return deepcopy([...this.userMap.values()])
  }
}

// 方法一
class MessageStore extends SessionStore {
  constructor () {
    super()
    this.userMessageMap = new Map()
  }

  // 转换数据
  mapToJson(map) {
    const temp = {}
    map.forEach((value, key) => {
      temp[key] = value
    })
    return temp
  }

  // 找到当前用户所有聊天列表的聊天记录
  find(uid, map = false) {
    let messageMap = this.userMessageMap.get(uid)
    if (!messageMap) (this.userMessageMap.set(uid, (messageMap = new Map())))
    return map ? messageMap : this.mapToJson(messageMap)
  }

  // 保存当前用户指定窗口的聊天记录
  save({ uid, to }, data) {
    const messageMap = this.find(uid, true)
    let list = messageMap.get(to)
    if (!list) messageMap.set(to, (list = []))
    list.push(data)
  }

  // 查找所有
  findAll(uid) {
    if (uid) {
      return this.find(uid)
    } else {
      return [...this.userMessageMap.values()]
    }
  }
}

// 方法二
class MessageStore2 extends SessionStore {
  constructor () {
    super()
    this.message = []
  }

  // 找到当前用户所有聊天列表的聊天记录
  find(uid) {
    const all = this.message.filter(({ from, to }) => (
      [uid, 'main'].includes(from) ||
      [uid, 'main'].includes(to)
    ))
    return all.reduce((temp, c) => {
      if (!temp[c.to]) temp[c.to] = []
      temp[c.to].push(c)
      return temp
    }, {})
  }

  // 保存当前用户指定窗口的聊天记录
  save(data) {
    this.message.push(data)
  }

  // 查找所有
  findAll(uid) {
    if (uid) {
      return this.find(uid)
    } else {
      return this.message.filter(({ from, to }) => (from === (uid || 'main') || to === (uid || 'main')))
    }
  }
}

module.exports = {
  UserSessionStore,
  MessageSessionStore: MessageStore2
}
