import md5 from 'md5'
import type { IDBConfig, IDBUser, IDBLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { username, password } = await readBody(event)

    if (!username) throw 'Vui lòng nhập tài khoản'
    if (username.length < 6 || username.length > 12) throw 'Tài khoản trong khoảng 6-12 ký tự'
    if (!!username.match(/\s/g)) throw 'Tài khoản không có khoảng cách'
    if (!(/^[a-z0-9]*$/g).test(username)) throw 'Tài khoản không có ký tự đặc biệt và viết hoa'
    if (!!username.includes('admin')
      || !!username.includes('smod')
      || !!username.includes('robot')
    ) throw 'Tài khoản không hợp lệ'

    if (!password) throw 'Vui lòng nhập mật khẩu'
    if (password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!password.match(/\s/g)) throw 'Mật khẩu không có khoảng cách'

    // Config
    const config = await DB.Config.findOne({}).select('logo_image enable promo') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    if(!config.enable.signup) throw 'Chức năng đăng ký đang bảo trì'

    // Check User
    const userCheck = await DB.User
    .findOne({ username: username })
    .select('username') as IDBUser
    if(!!userCheck) throw 'Tài khoản đã tồn tại'

    // Create
    const user = await DB.User.create({
      username: username,
      password: md5(password),
      avatar: config.logo_image || '/images/user/default.png',
      currency: {
        coin: config.promo.register.coin > 0 ? config.promo.register.coin : 0,
      }
    })

    // Update Level
    const realLevel = await DB.Level.findOne({
      $and: [
        { 'need.login': { $lte: user.login.total } },
        { 'need.pay.money': { $lte: user.pay.total.money } },
        { 'need.pay.count': { $lte: user.pay.total.count } },
        { 'need.spend.coin': { $lte: user.pay.total.money } },
        { 'need.spend.count': { $lte: user.pay.total.count } },
      ]
    })
    .select('number')
    .sort({ number: -1 }) as IDBLevel
    user.level = realLevel._id
    await user.save()

    // Send Notify and Save Log
    logUser(event, user._id, 'Đăng ký tài khoản nhanh')
    if(config.promo.register.coin > 0) logUser(event, user._id, `Nhận <b>${config.promo.register.coin.toLocaleString('vi-VN')}</b> từ khuyến mãi đăng ký tài khoản mới`)
    
    return resp(event, { message: 'Đăng ký thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})