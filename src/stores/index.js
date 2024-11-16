import {defineStore} from 'pinia';
import CryptoJS from 'crypto-js';
import {getUser} from '@/API/UserAPI.js'; // 假设 getUser 是一个 API 请求函数

const SECRET_KEY = 'SaigyoujiZheep';  // 替换为你自己的密钥

const useLoginStore = defineStore({
    id: 'login', state: () => ({
        token: '', userData: {
            articleCount: "封印",
            avatar: "https://img.picgo.net/2024/10/25/d693c6f605470263c9e42740e8bed7d2909387c156c4a646.png",
            categoryCount: "封印",
            email: "未登录",
            role: 4,
            username: "名もなき小妖"
        },  // 用于存储用户信息
    }), persist: {
        enabled: true,  // 开启数据持久化
        strategies: [{
            key: 'login',  // 设置存储的 key
            storage: localStorage,  // 使用 localStorage 持久化
        },],
    }, getters: {
        getToken: (state) => CryptoJS.AES.decrypt(state.token, SECRET_KEY).toString(CryptoJS.enc.Utf8),
        isLoggedIn: (state) => state.token !== '',
        getUserData: (state) => state.userData,  // 获取用户信息
    }, actions: {
        clearSession() {
            this.token = ''; // 清除 token
            this.userData = null; // 清除用户数据
        }, setToken(newToken) {
            // 加密 token 并存储到 state 和 localStorage
            this.token = CryptoJS.AES.encrypt(newToken, SECRET_KEY).toString();

            // 在设置 token 后，自动获取用户信息
            this.fetchUserInfo();
        }, async fetchUserInfo() {
            try {
                // 使用 token 获取用户信息的 API 请求
                // 假设 getUser 函数会根据 token 获取用户数据
                // 将用户信息存储到 state
                this.userData = (await getUser()).code === 1 ? (await getUser()).data :this.userData;
            } catch (error) {
                console.error('获取用户信息失败', error);
                this.userData = null;  // 出错时，清空用户信息
            }
        },
    },
});

export default useLoginStore;
