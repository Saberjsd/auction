//import Vue from 'vue';
//import Vuex from 'vuex';
//Vue.use(Vuex);
export default new Vuex.Store({
    state:{
        user:null,
        sidebars:'01', //{"auction":"01","collection":"02","myGround":"03","record":"04"}
        groundStep:'2',  //未开拍"1",拍卖中"2",已拍卖"3"
        areaIn:true, //是否显示区域
        currentGroundID: '0xWX4SDFSD1LKH',  //当前地块的ID
        currentAreaID:'001', //当前区域的ID
        records:[
            {land_id:'0xWX4SDFSD1LKH',status:0},
            {land_id:'0xWX4EYEFP1BHQ',status:1}
        ],
        collections:[{land_id:'0xWX4SDFSD1LKH'}],
        groundShowDetail:true //是否显示下拉菜单
    },
    getters: {
        currentGround:function(state){
            var res = state.records.filter(function(item){
                return item.land_id == state.currentGroundID
            });
            if(res.length>0){
                return res[0]
            }else{
                return null;
            }    
        }
    },
    mutations:{
        setUser(state,user){
            state.user=user;
        },
        setData(state,payload){
            state[payload.state]=payload.data
        },
        setGroundShowDetail(state){
            state.groundShowDetail = !state.groundShowDetail
        },


        logout(state){
            state.user=null
        }
    },
    actions:{
        setUser({commit},payload){
            commit("setUser",payload)
        },
        setData({commit},payload){
            commit("setData",payload)
        },
        setGroundShowDetail({commit}){
            commit('setGroundShowDetail')
        },
    

        logout({commit}){
            commit("logout");
        }
    }
});