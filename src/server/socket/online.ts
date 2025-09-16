import type { Server as SocketServer, Socket } from 'socket.io'
import type { Types } from 'mongoose'
import { IDBUser } from '~~/types'

const sendOnline = async (io : SocketServer, socket? : Socket) => {
  const online = await DB.SocketOnline.aggregate([
    { $addFields: { user: { $cond: [{$not: ["$user"]}, '$socket', '$user']} }},
    { $group: { _id: '$user' }}
  ])
  io.emit('online', online.length)
}

export default async (io : SocketServer, socket : Socket) => {
  await DB.SocketOnline.create({ socket: socket.id })

  socket.on('online-join', async (id? : Types.ObjectId) => {
    if(!id) return sendOnline(io) // Là máy khách không đăng nhập

    // Lấy thống tin User
    const user = await DB.User.findOne({ _id: id }).select('username') as IDBUser
    if(!user) return

    // Cập nhật lại Socket Data
    await DB.SocketOnline.findOneAndUpdate({ socket: socket.id }, { user: user._id }, { upsert: true })

    // Set User Channel
    socket.authID = user._id.toString()
    socket.join(socket.authID)

    // Gửi đến client của người đăng nhập để bắt đầu lấy các thông tin khác
    socket.emit('online-sign-in')
    sendOnline(io)
  })

  socket.on('online-logout', async () => {
    if(!socket.authID) return // Chưa đăng nhập, không làm gì cả

    // Cập nhật dữ liệu Socket
    await DB.SocketOnline.updateOne({ socket: socket.id }, { user: null })

    // Remove Auth User Channel
    !!socket.authID && socket.leave(socket.authID), socket.authID = null
    sendOnline(io)
  })

  socket.on('disconnect', async () => {
    // Delete In Data
    await DB.SocketOnline.deleteOne({ socket: socket.id })
    // Remove User Channel
    !!socket.authID && socket.leave(socket.authID), socket.authID = null

    sendOnline(io)
  })
}