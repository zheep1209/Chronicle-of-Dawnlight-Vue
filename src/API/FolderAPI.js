import {get, post, put,del} from '@/utils/request.js'
export const create = (data) => {
    return post("/folders/create", data)
}
export const folderFolders = (id) => {
    return get(`/folders/${id}/subfolders`)
}
export const allFolder = () => {
    return get(`/folders/allFolder`)
}
export const deleteFolder = (id) => {
    return del(`/folders/${id}`)
}