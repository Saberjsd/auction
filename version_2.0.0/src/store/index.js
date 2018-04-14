//import Vue from 'vue';
//import Vuex from 'vuex';
//Vue.use(Vuex);
export default new Vuex.Store({
    state:{
        user:null,
        sidebars:'01', //{"auction":"01","collection":"02","myGround":"03","record":"04"}
        groundStep:'1',  //未开拍"1",拍卖中"2",已拍卖"3"
        areaIn:true, //是否显示区域
    },
    mutations:{
        setUser(state,user){
            state.user=user;
        },
        setActive(state,activeName){
            state.activeName=activeName
        },
        logout(state){
            state.user=null
        }
    },
    actions:{
        setUser({commit},payload){
            commit("setUser",payload)
        },
        setActive({commit},payload){
            commit("setActive",payload)
        },
        logout({commit}){
            commit("logout");
        }
    }
});