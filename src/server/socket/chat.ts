import type { Server as SocketServer, Socket } from 'socket.io'
import type { IDBUser } from "~~/types"

export default (io : SocketServer, socket : Socket) => {
  // Chat Global
  socket.on('chat-global-send', async (data) => { 
    try {
      if(!socket.authID) throw 'Bạn chưa đăng nhập'
      const { text } = data
      if(!text) throw 'Vui lòng nhập nội dung'
      if(text.length > 100) throw 'Nội dung không vượt quá 100 ký tự'

      // Get User
      const user = await DB.User
      .findOne({ _id: socket.authID })
      .select('username level avatar type')
      .populate({ path: 'level',  select: 'number' }) as IDBUser
      if(!user) throw 'Tài khoản không tồn tại'

      const chat = await DB.SocketChat.create({
        user: user._id,
        text: text,
        type: 'message'
      })
      const result = JSON.parse(JSON.stringify(chat))
      result.user = user

      return io.emit('chat-global-push', result)
    }
    catch(e:any) {
      socket.emit('chat-global-send-error', { message: e.toString() })
    }
  })
}