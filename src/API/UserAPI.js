import {get, post} from '@/utils/request.js'

//注册
export const register = (data, code) => {
    return post("/admin/user/register?code=" + code, data)
}
//登录
export const loginByPass = (username, password) => {
    return get(`/admin/user/loginWithPassword?username=${username}&password=${password}`, "")
}
export const loginByEmail = (email, code) => {
    return get(`/admin/user/loginWithEmail?email=${email}&code=${code}`, "")
}
//获取验证码
export const getCode = (params) => {
    return get(`/mail/sendMailCaptcha?to=${params}`)
}

//获取用户数据
export const getUser = () => {
    return get("/admin/user/getUser")
}


