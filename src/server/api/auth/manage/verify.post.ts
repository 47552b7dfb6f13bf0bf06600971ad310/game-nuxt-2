import { IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { password } = await readBody(event)
    if(!password) throw 'Vui lòng nhập đầy đủ thông tin'

    const config = await DB.Config.findOne().select('gm_password') as IDBConfig
    if(password != config.gm_password) throw 'Mã ủy quyền không hợp lệ'

    const runtimeConfig = useRuntimeConfig()
    setCookie(event, 'token-admin', 'true', runtimeConfig.public.cookieConfig)

    return resp(event, { message: 'Xác thực quản trị viên thành công', result: '/manage' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})