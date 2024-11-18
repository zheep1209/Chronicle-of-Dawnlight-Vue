import {createRouter, createWebHashHistory} from 'vue-router';
import useLoginStore from "@/stores/index.js";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL), routes: [{
        path: '/', name: 'home', component: () => import('@/views/HOME.vue')
    }, {
        path: '/login', name: 'login', component: () => import('@/views/Login.vue')
    }, {
        path: '/register', name: 'register', component: () => import('@/views/Register.vue')
    }, {
        path: '/user', name: 'user', component: () => import('@/views/UserLayout.vue'),

        children: [{
            path: '/article', // 修改为相对路径
            name: 'article', component: () => import('@/views/ArticleHome.vue')
        }, {
            path: '/wenwenNews', // 修改为相对路径
            name: 'wenwenNews', component: () => import('@/views/WenwenNews.vue')
        }, {
            path: '/qwq/:id', // 修改为相对路径
            name: 'articleContent', component: () => import('@/views/ArticleContent.vue')
        }, {
            path: '/bill', // 修改为相对路径
            name: 'bill', component: () => import('@/views/BillHome.vue')
        }, {
            path: '/userCenter', name: 'userCenter', component: () => import('@/views/UserCenter.vue')
        }]
    }, {
        name: '404', path: '/:catchAll(.*)', component: () => import(`@/views/404.vue`)
    }]
});
// 路由守卫
router.beforeEach((to, from, next) => {
    // 定义无需认证的路由路径
    const openRoutes = ['/', '/login', '/register', '/wenwenNews', '/qwq/:id'];

    // 检查目标路径是否在无需认证列表中
    const isOpenRoute = openRoutes.some((route) => {
        // 支持动态路由匹配，例如 '/qwq/:id'
        const dynamicRouteRegex = new RegExp(`^${route.replace(/:\w+/g, '[^/]+')}$`);
        return dynamicRouteRegex.test(to.path);
    });

    if (isOpenRoute) {
        // 如果是无需认证的路由，直接导航
        next();
    } else {
        // 对于需要认证的路由，检查登录状态
        if (!useLoginStore().isLoggedIn) {
            // 如果未登录，重定向到登录页
            next({name: 'login'});
        } else {
            // 已登录则继续导航
            next();
        }
    }
});

export default router;
       