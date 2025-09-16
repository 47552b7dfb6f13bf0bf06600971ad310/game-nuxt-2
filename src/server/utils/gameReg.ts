import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'
import axios from 'axios'

interface ISendData {
  username: string
  password: string
}

export default async (event: H3Event, data : ISendData) : Promise<any> => {
  try {
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.reg) throw 'Tính năng đăng ký tài khoản trong trò chơi đang bảo trì'

    const send = await axios.post(config.game.api.reg, { ...data })
    const res = send.data
    if(res.error) throw res.error
  }
  catch (e:any) {
    throw e.toString()
  }
}