import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/pages/index/index'
import detail from '@/pages/detail/detail'
import auction_map from '@/pages/auction_map/auction_map'
import auction_market from '@/pages/auction_market/auction_market'
import market1 from '@/pages/auction_market/market1'

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
        },
        {
            path: '/auction_map',
            name: 'auction_map',
            component: auction_map
        },
        {
            path: '/auction_market',
            name: 'auction_market',
            component: auction_market
        }
        ,
        {
            path: '/market1',
            name: 'market1',
            component: market1
        }
    ]
})