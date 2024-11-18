import {del, get, post, put} from '@/utils/request.js'
// POST
// 根据用户名查找用户ID，保存文章
export const createArticle = (data) => {
    return post("/article/create", data)
}
// PUT
// 根据用户id和文章ID进行权限检查，并修改文章
export const updateArticle = (id, data) => {
    return put(`/article/update/${id}`, data)
}
// DELETE
// 根据用户id和文章ID进行权限检查，并删除文章
export const deleteArticle = (ids) => {
    return del(`/article/delete`, ids)
}
// GET
// 根据用户id查找并返回用户的所有文章
export const listArticles = () => {
    return get("/article/list")
}
// GET
// 根据查找并返回公开的所有文章
export const listPublicArticles = () => {
    return get("/publicArticle")
}
//GET
//根据文章ID和公开属性返回文章
export const publicArticleByArticleID = (id) => {
    return get(`/publicArticleByArticleID/${id}`)
}

// GET
// 根据用户id和文章ID进行权限检查，并返回文章详情
export const getArticle = (id) => {
    return get(`/article/${id}`)
}
// GET
// 根据用户id和分类ID进行权限检查，并返回文章列表
export const getArticleByCategoryId = (id) => {
    return get(`/byUserAndCategory?categoryId=${id}`)
}
//PUT
// 根据文章ID列表进行批量修改文章分类ID
export const updateCategoryByIds = (ids, id) => {
    return put(`/updateCategoryByIds?ids=${ids}&categoryId=${id}`)
}