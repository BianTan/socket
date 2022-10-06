
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

module.exports = {
  ErrorReturn
}
