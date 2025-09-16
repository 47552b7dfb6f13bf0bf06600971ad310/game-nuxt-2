import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, range, server } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!range) throw 'Dữ liệu thời gian sai'

    const match : any = {}
    if(!!server) match['server'] = server
    if(!!range && !!range['start'] && !!range['end']){
      const start : any = DayJS(range['start']).startOf('date')
      const end : any = DayJS(range['end']).endOf('date')
      match['createdAt'] = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
    }

    const data = await DB.EggHistory.aggregate([
      { $match: match },
      { $project: { user: 1, price: 1 } },
      {
        $unionWith: {
          coll: "ShopHistory",
          pipeline: [
            { $match: match },
            { $project: { user: 1, price: 1 } }
          ]
        }
      },
      {
        $unionWith: {
          coll: "ShopPackHistory",
          pipeline: [
            { $match: match },
            { $project: { user: 1, price: 1 } }
          ]
        }
      },
      {
        $group: {
          _id: "$user",
          value: { $sum: "$price" }
        }
      },
      {
        $lookup: {
          from: "User",
          localField: "_id",
          foreignField: "_id",
          pipeline: [
            { $project: { username: 1 }}
          ],
          as: "user"
        }
      },
      { $unwind: { path: "$user" }},
      {
        $facet: {
          list: [
            { $sort: { value: -1 } },
            { $skip: (current - 1) * size },
            { $limit: size },
          ],
          pagination: [
            { $count: "total" }
          ]
        }
      }
    ])

    return resp(event, { result: { 
      list: data[0].list ? data[0].list : [],
      total: data[0].pagination ? (data[0].pagination[0] ? data[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})