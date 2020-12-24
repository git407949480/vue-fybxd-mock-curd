import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Detail from '../views/Detail.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/detail',
        name: 'Detail',
        component: Detail
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    //我在这里模仿了一个获取用户信息的方法
    let isLogin = window.sessionStorage.getItem('sessionId');
    if (isLogin) {
        //如果用户信息存在则往下执行。
        next()
    } else {
        //如果用户token不存在则跳转到login页面
        if (to.path === '/login') {
            next()
        } else {
            next('/login')
        }
    }
})

export default router
