import type { IAuth, IDBGameRankPowerUpProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.add')

    const body = await readBody(event)
    const { name, start, end, servers } = body
    if(!name || !start || !end) throw 'Dữ liệu đầu vào không hợp lệ'

    const startDate = formatDate(start)
    const endDate = formatDate(end)
    if(startDate.timestamp > endDate.timestamp) throw 'Thời gian bắt đầu không thể lớn hơn thời gian kết thúc'

    await DB.GameRankPowerUpProcess.create({
      ...body,
      start: startDate.dayjs.startOf('date')['$d'],
      end: endDate.dayjs.endOf('date')['$d'],
    })
    logAdmin(event, `Tạo tiến trình sự kiện tăng lực chiến cho máy chủ <b>${servers.join(',')}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})