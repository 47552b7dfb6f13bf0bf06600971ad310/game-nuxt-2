import cron from 'node-cron'

export default defineNitroPlugin(() => {
  cron.schedule('00 23 * * *', async () => {
    await rankProcessAward()
  }, {
    timezone: 'Asia/Ho_Chi_Minh'
  })

  cron.schedule('55 23 * * *', async () => {
    await rankPowerUpProcessWrite()
  }, {
    timezone: 'Asia/Ho_Chi_Minh'
  })

  // cron.schedule('59 23 * * *', async () => {
  //   await rankPowerUpProcessAward()
  // }, {
  //   timezone: 'Asia/Ho_Chi_Minh'
  // })
})