import {del, get, post, put} from '@/utils/request.js'

//新增交易记录
export const createTr = (data) => {
    return post("/transaction/create", data)
}
//修改交易记录
export const updateTr = (data) => {
    return put(`/transaction/update`, data)
}
// //查询交易记录
// export const getDay = (id) => {
//     return get(`/transaction/get?id=${id}`)
// }

//删除交易记录
export const deleteTr = (id) => {
    return del(`/transaction/delete?id=${id}`)
}

// 查询每日汇总
export const getDailySummary = (date) => {
    return get(`/transaction/daily?date=${date}`)
}

// 查询每月汇总
export const getMonthlySummary = (month) => {
    return get(`/transaction/monthly?month=${month}`)
}

// 查询每年汇总
export const getYearlySummary = (year) => {
    return get(`/transaction/yearly?year=${year}`)
}
