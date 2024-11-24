import {defineStore} from 'pinia';

const usePageStore = defineStore({
    id: 'page', state: () => ({
        page: 1,  // 用于存储用户信息
        color: 0,
    }), persist: {
        enabled: true,  // 开启数据持久化
        strategies: [{
            key: 'pageModel',  // 设置存储的 key
            storage: localStorage,  // 使用 localStorage 持久化
        },],
    }, getters: {
        getModel: (state) => state.page, getColor: (state) => state.color,
    }, actions: {
        setPageModel(newPageModel) {
            this.page = newPageModel
            console.log('setPageModel', newPageModel)
        },
        setColor(newColor) {
            this.color = newColor
            console.log('setPageModel', newColor)
        },
    },
})


export default usePageStore;
