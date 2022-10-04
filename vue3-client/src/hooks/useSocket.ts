import { io, Socket } from 'socket.io-client'

const URL = 'http://localhost:9527'
let socket: Socket | null = null

export const useSocket = () => {

  if (!socket) {
    socket = io(URL, {
      autoConnect: false,
      transports : ['websocket'] 
    })
  }

  // 开发使用, 输出所有监听信息
  socket.onAny((event, ...args) => {
    console.log(event, args);
  })

  return {
    socket
  }
}
