import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'
import axios from 'axios'

interface ISendData {
  server_id: string
}

export default async (event: H3Event | null, data : ISendData, throwError : boolean = true) : Promise<any> => {
  try {
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.rank_power) throw 'Tính năng xem bảng xếp hạng cấp độ đang bảo trì'

    const send = await axios.post(config.game.api.rank_power, {
      secret: config.game.secret,
        ...data
    })
    const res = send.data
    if(res.error) throw res.error
    return Promise.resolve(res.data || [])
  }
  catch (e:any) {
    if(!throwError) return Promise.resolve([])
    else throw e.toString()
  }
}