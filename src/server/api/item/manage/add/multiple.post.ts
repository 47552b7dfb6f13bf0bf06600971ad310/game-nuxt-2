import type { IAuth, IDBItem } from "~~/types"
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { items } = body
    if(!items) throw 'Dữ liệu đầu vào sai'

    const url =  new URL(items, runtimeConfig.public.clientURL)
    const send = await axios.get(url.href)
    const res = send.data

    const list = res.map((i : IDBItem) => ({ 
      item_id: i.item_id, 
      item_name: i.item_name,
      item_image: i.item_image,
      type: i.type || 'game_item'
    }))
    list.forEach(async (i : IDBItem) => {
      const check = await DB.Item.findOne({ item_id: i.item_id }).select('_id') as IDBItem
      if(!!check) await DB.Item.updateOne({ _id: check._id }, i)
      else await DB.Item.create(i)
    })

    logAdmin(event, `Thêm danh sách vật phẩm trò chơi`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})