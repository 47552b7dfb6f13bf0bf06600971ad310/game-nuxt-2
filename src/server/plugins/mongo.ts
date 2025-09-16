import type { IGlobalDB } from '~~/types'
import mongoose from 'mongoose';
import Model from '../model'

declare global {
  var DB : IGlobalDB
}

// const formattedNames = {
//   ads_from: "AdsFrom",
//   ads_landing: "AdsLanding",
//   admin_ip: "AdminIp",
//   configs: "Config",
//   dices: "Dice",
//   dice_histories: "DiceHistory",
//   dice_lucky_users: "DiceLuckyUser",
//   eggs: "Egg",
//   egg_histories: "EggHistory",
//   egg_users: "EggUser",
//   events: "Event",
//   event_configs: "EventConfig",
//   event_histories: "EventHistory",
//   game_rank_power: "GameRankPowerUp",
//   game_rank_power_process: "GameRankPowerUpProcess",
//   gates: "Gate",
//   giftcodes: "Giftcode",
//   giftcode_histories: "GiftcodeHistory",
//   items: "Item",
//   item_boxs: "ItemBox",
//   levels: "Level",
//   admin_logs: "LogAdmin",
//   admin_senditem_logs: "LogAdminSendItem",
//   block_ip_logs: "LogBlockIP",
//   user_ip_logs: "LogUserIP",
//   user_logs: "LogUser",
//   news: "News",
//   news_categories: "NewsCategory",
//   payment_config: "PaymentConfig",
//   payments: "Payment",
//   shops: "Shop",
//   shop_config: "ShopConfig",
//   shop_histories: "ShopHistory",
//   shop_packs: "ShopPack",
//   shop_box_histories: "ShopPackHistory",
//   socket_chats: "SocketChat",
//   socket_onlines: "SocketOnline",
//   spends: "Spend",
//   users: "User",
//   user_login_logs: "UserLogin",
//   wheel_histories: "WheelHistory",
//   wheel_lucky_users: "WheelLuckyUser",
//   wheels: "Wheel",
// }

export default defineNitroPlugin(async (nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(runtimeConfig.mongoURI, { 
      dbName: runtimeConfig.mongoDB 
    })
    .then(async () => {
      // const db = mongoose.connection.db
      // const collections = await db.listCollections().toArray()
      // collections.forEach(async (table) => {
      //   // @ts-expect-error
      //   if(formattedNames[table.name]) await db.renameCollection(table.name, formattedNames[table.name])
      // })

      global.DB = Model(mongoose)
    })
    .catch(e => {
      throw createError({ statusCode: 500, message: e.toString() })
    })
  }
})