import {get, post, put,del} from '@/utils/request.js'
export const getTouhouUrl = () => {
    return get("/tools/getTouhouUrl")
}