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
    onMessage(payload: MsgItem) {
      const userStore = useUserStore()
      if (!userStore.info) return
      // 查找
      let toMsgList = this.messageList[payload.to]
      if (!toMsgList) toMsgList = this.messageList[payload.to] = []
      // 新增记录
      toMsgList.push(payload)

      // 下面是给聊天列表添加新消息红点提醒的操作
      const indexOf = this.rooms.findIndex(f => f.id === payload.to)
      const { id, count = 0 } = this.rooms[indexOf]
      Object.assign(this.rooms[indexOf], {
        msg: payload.msg,
        count: this.curRooms === id ? 0 : count + 1
      })
    }
  }
})
