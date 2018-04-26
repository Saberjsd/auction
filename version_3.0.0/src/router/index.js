// import Vue from 'vue'
// import Router from 'vue-router'
//import login from '../pages/login/login'
//import index from '@/pages/index/index'


// Vue.use(Router)
var index = ()=> import("@/pages/index/index2")
var login =()=>import("@/pages/login/login")

var Join=()=>import("@/pages/joinAuction/index")
export default new VueRouter
({
    routes: [{
            path: '/',
            name: 'login',
            component: login
        },
        {
            path: '/index',
            name: 'index',
            component: index,
            children:[
                {
                    path:"join",
                    name:"Join",
                    component:Join,
                    children:[
                        {
                            
                            path:"land/:id",
                              
                        },{
                            path:"area/:id",
                        }
                    ]
                }

            ]
        }
    ]
})