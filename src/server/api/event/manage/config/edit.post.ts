import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const {_id, start, end } = body
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const eventConfig = await DB.EventConfig.findOne({ _id: _id }).select('name')
    if(!eventConfig) throw 'Cấu hình sự kiện không tồn tại'

    const startDate = formatDate(start)
    const endDate = formatDate(end)

    delete body['_id']
    const data = await DB.EventConfig.findOneAndUpdate({ _id: _id }, {
      ...body,
      start: !!start ? startDate.dayjs.startOf('date')['$d'] : null,
      end: !!end ? endDate.dayjs.endOf('date')['$d'] : null,
    }, { new: true })
    
    logAdmin(event, `Sửa cấu hình sự kiện <b>${ eventConfig.name }</b>`)
    return resp(event, { message: 'Sửa thành công', result: data })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})