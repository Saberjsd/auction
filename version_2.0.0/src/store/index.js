//import Vue from 'vue';
//import Vuex from 'vuex';
//Vue.use(Vuex);
export default new Vuex.Store({
    state:{
        user:null,
        sidebars:'01', //{"auction":"01","collection":"02","myGround":"03","record":"04"}
        groundStep:'1',  //未开拍"1",拍卖中"2",已拍卖"3"
        areaIn:true, //是否显示区域
        records:[{gid:'0xmlsdfl1231',status:0}],
        collections:[{id:'0x123156131FDSV1531'}],
    },
    getters: {
        groundIn:function(){
            if(state.siderbars == "01"){
              return !state.areaIn
            }
            if(state.siderbars == "02"||state.siderbars == "03"){
              return true;
            }
        }
    },
    mutations:{
        setUser(state,user){
            state.user=user;
        },
        setSidebars(state,sidebars){
            state.sidebars=sidebars
        },
        setGroundStep(state,sidebars){
            state.groundStep=groundStep
        },
        setAreaIn(state,sidebars){
            state.areaIn=areaIn
        },

        logout(state){
            state.user=null
        }
    },
    actions:{
        setUser({commit},payload){
            commit("setUser",payload)
        },
        setSidebars({commit},payload){
            commit("setSidebars",payload)
        },
        setGroundStep({commit},payload){
            commit("setGroundStep",payload)
        },
        setAreaIn({commit},payload){
            commit("setAreaIn",payload)
        },

        logout({commit}){
            commit("logout");
        }
    }
});