import { defineStore } from 'pinia'
import { useUserStore } from './user'

export interface RoomItem {
  name: string;
  id: string;
  img: string;
  msg?: string;
  count?: number;
}
export interface MsgItem {
  msg: string;
  from: string;
  to: string;
  date: number;
}
interface ChatState {
  curRooms: string;
  rooms: RoomItem[];
  messageList: Record<string, MsgItem[]>;
}

export const useChatStore = defineStore({
  id: 'app-chat',
  state: (): ChatState => ({
    curRooms: '',
    rooms: [],
    messageList: {}
  }),
  actions: {
    // 接收到新消息
    onMessage(payload: MsgItem) {
      const userStore = useUserStore()
      if (!userStore.info) return
      const { to, from } = payload
      const { uid: curUID } = userStore.info
      // 查找
      const key = (to === 'main' || from === curUID) ? to : from
      let toMsgList = this.messageList[key]
      if (!toMsgList) toMsgList = this.messageList[key] = []
      // 新增记录
      toMsgList.push(payload)

      const { msg } = payload
      const indexOf = this.rooms.findIndex(({ id }) => id === from || id === to)
      console.log('indexOf', indexOf, from, to)
      if (indexOf < 0) {
        const user = userStore.users.find(({ uid }) => uid === payload.from)
        if (!user) return
        const { nickname, avatar, uid } = user
        // 新增列表
        this.rooms.push({
          name: nickname,
          img: avatar,
          id: uid,
          count: 1,
          msg
        })
      } else {
        // 聊天列表添加新消息红点提醒
        const { id, count = 0 } = this.rooms[indexOf]
        Object.assign(this.rooms[indexOf], {
          msg,
          count: this.curRooms === id ? 0 : count + 1
        })
      }
    }
  }
})
