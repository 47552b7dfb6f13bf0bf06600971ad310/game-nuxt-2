import type { IAuth, IDBGameRankPowerUpProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.edit')

    const body = await readBody(event)
    const { _id, servers, name, start, end, active } = body
    if(!_id || !servers || !name || !start || !end) throw 'Dữ liệu đầu vào không hợp lệ'

    const startDate = formatDate(start)
    const endDate = formatDate(end)
    if(startDate.timestamp > endDate.timestamp) throw 'Thời gian bắt đầu không thể lớn hơn thời gian kết thúc'

    const processEvent = await DB.GameRankPowerUpProcess.findOne({ _id: _id }).select('servers active send end') as IDBGameRankPowerUpProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'

    if(!!active) {
      if(!!processEvent.send) throw 'Không thể kích hoạt khi hệ thống đã trả thưởng'
      const endOfToday = formatDate(new Date()).dayjs.endOf('date').unix()
      const endOfEvent = endDate.dayjs.endOf('date').unix()
      if(endOfToday > endOfEvent) throw 'Không thể kích hoạt khi thời gian kết thúc là quá khứ'
    }

    delete body['_id']
    await DB.GameRankPowerUpProcess.updateOne({ _id: processEvent._id }, {
      ...body,
      start: startDate.dayjs.startOf('date')['$d'],
      end: endDate.dayjs.endOf('date')['$d'],
    })

    if(!!active) await rankPowerUpProcessWrite(processEvent._id)

    logAdmin(event, `Sửa tiến trình sự kiện tăng lực chiến của máy chủ <b>${processEvent.servers.join(',')}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})