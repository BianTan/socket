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
  avatar: string;
  nickname: string;
  msg: string;
  isMe: boolean;
}
interface ChatState {
  curRooms: string;
  rooms: RoomItem[];
  msgMap: Record<string, MsgItem[]>;
}

export const useChatStore = defineStore({
  id: 'app-chat',
  state: (): ChatState => ({
    curRooms: '',
    rooms: [],
    msgMap: {}
  }),
  actions: {
    onMessage(payload: {
      msg: string;
      from: string;
      to: string;
    }) {
      const userStore = useUserStore()
      if (!userStore.info) return
      const { uid } = userStore.info
      const temp = {
        avatar: '',
        nickname: '',
        msg: payload.msg,
        isMe: uid === payload.from
      }
      if (temp.isMe) {
        const { avatar, nickname } = userStore.info
        Object.assign(temp, {
          avatar,
          nickname
        })
      } else {
        if (payload.to === 'main') {
          const info = userStore.users.find(f => f.uid === payload.from)
          if (!info) return
          Object.assign(temp, {
            avatar: info.avatar,
            nickname: info.nickname
          })
        } else {
          const info = this.rooms.find(f => f.id === payload.from)
          if (!info) return
          Object.assign(temp, {
            avatar: info.img,
            nickname: info.name
          })
        }
      }
      let toMsgList = this.msgMap[payload.to]
      if (!toMsgList) toMsgList = this.msgMap[payload.to] = []
      toMsgList.push(temp)

      const indexOf = this.rooms.findIndex(f => f.id === payload.to)
      const { id, count = 0 } = this.rooms[indexOf]
      Object.assign(this.rooms[indexOf], {
        msg: payload.msg,
        count: this.curRooms === id ? 0 : count + 1
      })
    }
  }
})
