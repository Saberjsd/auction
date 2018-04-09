import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/pages/index/index'
import detail from '@/pages/detail/detail'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/index',
            name: 'index',
            component: Index
        },
        {
            path: '/detail',
            name: 'detail',
            component: detail
        }
    ]
})