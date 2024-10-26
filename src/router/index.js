import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HOME.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/Register.vue')
        },
        {
            path: '/user',
            name: 'user',
            component: () => import('@/views/UserLayout.vue'),
            children: [
                {
                    path: '/article', // 修改为相对路径
                    name: 'article',
                    component: () => import('@/views/ArticleHome.vue')
                },
                {
                    path: '/bill', // 修改为相对路径
                    name: 'bill',
                    component: () => import('@/views/BillHome.vue')
                }
            ]
        }
    ]
});

export default router;
       