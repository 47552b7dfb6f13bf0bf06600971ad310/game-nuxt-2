import type { IAuth, IDBGameRankProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.add')

    const body = await readBody(event)
    const { server, type, end } = body
    if(!server || !type || !end) throw 'Dữ liệu đầu vào không hợp lệ'
    
    const getByServer = await DB.GameRankProcess.findOne({ server: server, type: type }).select('_id') as IDBGameRankProcess
    if(!!getByServer) throw 'Tiến trình cho máy chủ này đã tồn tại'

    await DB.GameRankProcess.create({
      ...body,
      end: formatDate(end).dayjs.hour(23).minute(0).second(0).millisecond(0)['$d'],
    })
    logAdmin(event, `Tạo tiến trình trả quà đua <b>TOP ${type == 'power' ? 'lực chiến' : 'cấp độ'}</b> cho máy chủ <b>${server}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})