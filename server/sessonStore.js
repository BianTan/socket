const deepcopy = require('deepcopy')

/* abstract */ class SessionStore {
  find(id) {}
  save(id, session, merge) {}
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

module.exports = {
  UserSessionStore
}
