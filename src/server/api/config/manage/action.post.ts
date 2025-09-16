import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'config.action')

    const data = await readBody(event)
    const { type } = data
    if(!type) throw 'Dữ liệu đầu vào không hợp lệ'

    if(type == 'reopen'){
      await DB.ShopHistory.deleteMany({})
      await DB.ShopPackHistory.deleteMany({})

      await DB.EventHistory.deleteMany({})

      await DB.GiftcodeHistory.deleteMany({})

      await DB.WheelHistory.deleteMany({})
      await DB.WheelLuckyUser.deleteMany({})

      await DB.DiceHistory.deleteMany({})
      await DB.DiceLuckyUser.deleteMany({})

      await DB.EggUser.deleteMany({})
      await DB.EggHistory.deleteMany({})
      
      await DB.LogUser.deleteMany({})
      await DB.LogAdminSendItem.deleteMany({})

      await DB.SocketChat.deleteMany({})
      await DB.SocketOnline.deleteMany({})

      await DB.Payment.deleteMany({ status: 0 })
      await DB.Payment.deleteMany({ status: 2 })
      await DB.Payment.updateMany({ status: 1 }, { status: 0 })

      await DB.GameRankProcessLog.deleteMany({})
      await DB.GameRankPowerUpProcessLog.deleteMany({})
      await DB.GameRankPowerUp.deleteMany({})

      await DB.UserLogin.deleteMany({})
      await DB.User.updateMany({}, {
        'referral.count': 0,
        'referral.person': null,
        'currency.coin': 0,
        'currency.wheel': 0,
        'currency.diamond': 0,
        'paymusty': [],
        'paydays.day': 0,
        'paydays.receive': 0,
        'pay.total.money': 0,
        'pay.day.money': 0,
        'pay.month.money': 0,
        'pay.total.count': 0,
        'pay.day.count': 0,
        'pay.month.count': 0,
        'spend.total.coin': 0,
        'spend.day.coin': 0,
        'spend.month.coin': 0,
        'spend.total.count': 0,
        'spend.day.count': 0,
        'spend.month.count': 0,
        'dice.total.coin': 0,
        'dice.day.coin': 0,
        'dice.month.coin': 0,
        'dice.total.count': 0,
        'dice.day.count': 0,
        'dice.month.count': 0,
        'wheel.total': 0,
        'wheel.day': 0,
        'wheel.month': 0,
        'login.month': 0,
        'login.total': 0
      })
      await DB.User.updateMany({ type: { $gt: 1 } }, { 'currency.coin': 100000000 })

      await logAdmin(event, 'Thao tác <b>Reopen</b>')
      !!IO && IO.emit('notice-reload', 'Có bản cập nhật mới, vui lòng tải lại trang !')
    }

    if(type == 'reset-config'){
      await DB.Config.updateMany({}, {
        name: 'Game',
        short_name: 'Game',
        description: 'Một sản phẩm của ENI Group',
        og_image: '',
        logo_image: '',
        logo_long_image: '',
        makeby: 'ENI Group',
        about: '',
        privacy: '',
        terms: '',
        gm_password: 'eni@gm',
        more_game: '',
        license: false,
        menu: {
          action: {
            payment: true,
            giftcode: true,
          },
          shop: {
            pack: true,
            item: true,
            currency: true,
          },
          event: {
            referral: true,
            login: true,
            pay: true,
            spend: true,
            paymusty: true,
            paydays: true
          },
          minigame: {
            wheel: true,
            dice: true,
            egg: true
          },
          rank: {
            level: true,
            power: true,
          }
        },
        enable: {
          signin: true,
          signup: true,
          play: true,
          referral: true,
          landing: false,
          signup_count: 5
        },
        homepage: {
          landing: null,
        },
        thankyou: {
          link: '',
        },
        download: {
          apk: '',
          ios: '',
        },
        contact: {
          name: '',
          phone: '',
          email: '',
          address: '',
          prefix: 'ENI',
        },
        social: {
          facebook: '',
          messenger: '',
          zalo: '',
        },
        promo: {
          register: {
            coin: 0
          },
          payment: {
            first: 0,
            second: 0
          }
        },
        game: {
          ip: '',
          mobile: false,
          image: '/item',
          secret: '@Secret',
          api: {
            start: '',
            server: '',
            role: '',
            roles: '',
            rank_level: '',
            rank_power: '',
            mail: '',
            recharge: '',
            os: '',
            reg: ''
          }
        },
        facebook: {
          client_id: '',
          client_secret: '',
          client_version: '',
          client_verify: '',
          client_ads: '',
        },
        google: {
          client_id: '',
          client_secret: '',
          client_verify: '',
          client_ads: '',
        },
        tiktok: {
          client_id: '',
          client_secret: '',
          client_verify: '',
        },
        zalo: {
          client_id: '',
          client_secret: '',
          client_verify: '',
        }
      })

      await logAdmin(event, 'Thao tác <b>đặt lại cấu hình</b> web')
      !!IO && IO.emit('config-update')
    }

    if(type == 'change-gm-password'){
      if(!data.gm_password) throw 'Vui lòng nhập đủ thông tin'
      await DB.Config.updateMany({}, {
        gm_password: data.gm_password
      })

      await logAdmin(event, 'Thao tác <b>đổi mật khẩu</b> ủy quyền')
    }

    if(type == 'api-more-game'){
      await DB.Config.updateMany({}, {
        more_game: data.more_game
      })

      await logAdmin(event, 'Thao tác sửa <b>API trò chơi khác</b>')
    }

    return resp(event, { message: 'Thực hiện thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})