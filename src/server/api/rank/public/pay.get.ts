import type { IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Config.findOne().select('menu.rank') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'

    const match : any = { money: { $gt: 0 } }
    const startDay : any = DayJS(config.menu.rank.paydate.start || null).startOf('date')
    const endDay : any = DayJS(config.menu.rank.paydate.end || null).startOf('date')
    match['time'] = { $gte: new Date(startDay['$d']), $lte: new Date(endDay['$d']) }

    const data = await DB.Payment.aggregate([
      {
        $project: {
          createdAt: 1,
          timeformat: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
          },
          user: 1,
          money: { $cond: [{$eq: ['$status', 1]} , '$money', 0] },
        }
      },
      {
        $group: {
          _id: {
            timeformat: '$timeformat',
            user: '$user'
          },
          time: { $min: '$createdAt' },
          money: { $sum: '$money' },
        }
      },
      { $match: match },
      {
        $group: {
          _id: '$_id.user',
          value: { $sum: '$money' },
        }
      },
      {
        $lookup: {
          from: "User",
          localField: "_id",
          foreignField: "_id",
          pipeline: [{
            $project: { username: 1 }
          }],
          as: "user"
        }
      },
      { $unwind: { path: "$user" }},
      { $sort: { value: -1 } },
      { $limit: 10 },
      { $addFields: {
        value: { $divide: ["$value", 10] }
      }}
    ])

    return resp(event, { result: data })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})