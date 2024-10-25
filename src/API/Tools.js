import instance, {post,get} from '@/utils/request.js'

//注册
export const register = (data,code)=>{
    return post("/admin/user/register?code="+code,data)
}
//登录
//获取验证码
export const getCode = (params)=>{
    return get("/getEmail",params)
}