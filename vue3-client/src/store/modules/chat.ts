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
      // 消息模板
      const temp = {
        avatar: '',
        nickname: '',
        msg: payload.msg,
        isMe: uid === payload.from
      }
      if (payload.to === 'main') {
        // 发送给公共大厅
        const fromUser = userStore.users.find(f => f.uid === payload.from)
        if (!fromUser) return
        Object.assign(temp, {
          avatar: fromUser.avatar,
          nickname: fromUser.nickname
        })
      } else {
        // 发送给其它人
        const fromInfo = this.rooms.find(f => f.id === payload.from)
        if (!fromInfo) return
        Object.assign(temp, {
          avatar: fromInfo.img,
          nickname: fromInfo.name
        })
      }
      // 查找
      let toMsgList = this.msgMap[payload.to]
      if (!toMsgList) toMsgList = this.msgMap[payload.to] = []
      // 新增记录
      toMsgList.push(temp)

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
