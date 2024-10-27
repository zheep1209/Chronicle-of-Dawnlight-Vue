import {get, post, put,del} from '@/utils/request.js'
// POST
// 根据用户名查找用户ID，保存文章
export const createArticle = (data) => {
    return post("/article/create",data)
}
// PUT
// 根据用户id和文章ID进行权限检查，并修改文章
export const updateArticle = (id,data) => {
        return put(`/article/update/${id}`,data)
}
// DELETE
// 根据用户id和文章ID进行权限检查，并删除文章
export const deleteArticle = (id) => {
    return del(`/article/delete/${id}`)
}
// GET
// 根据用户id查找并返回用户的所有文章
export const listArticles = () => {
    return get("/article/list")
}
// GET
// 根据用户id和文章ID进行权限检查，并返回文章详情
export const getArticle = (id) => {
    return get(`/article/${id}`)
}