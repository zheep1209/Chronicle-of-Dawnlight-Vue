import {get, post, put,del} from '@/utils/request.js'
//{name}
export const createCategories = (data) => {
    return post("/categories", data)
}
// id,name
export const updateCategories = (data) => {
    return put("/categories", data)
}
// id
export const delCategories = (id) => {
    return del (`/categories/${id}`)
}
export const getCategoriesList = () => {
    return get("/categories")
}