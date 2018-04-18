//import Vue from 'vue';
//import Vuex from 'vuex';
//Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        user:null,
        sidebars:'01', //{"auction":"01","collection":"02","myGround":"03","record":"04"}
        groundStep:0,  //未开拍0 拍卖中1,2  已拍卖3
        groundIn:false,  //是否显示地块
        // areaIn:true, //是否显示区域
        areaDatail:{}, 
        areaList:[],  
        landList:[],
        records:[
            // {land_id:'0xWX4SDFSD1LKH',status:0},
            // {land_id:'0xWX4EYEFP1BHQ',status:1}
        ],
        collections:[
            // {land_id:'0xWX4SDFSD1LKH'}
        ],
        currentCityID: 1,
        currentAreaID: 1, //当前区域的ID        
        currentGroundID: 1,  //当前地块的ID
        
        groundShowDetail:true, //是否显示下拉菜单
        // inputPriceCount = 0,  //出价倒计时
    },
    getters: {
        currentGround:function(state){
            var res = state.landList.filter(function(item){
                return item.id == state.currentGroundID
            });
            if(res.length>0){
                return res[0]
            }else{
                return {
                    signId:'',
                    classify:'',
                    state:0,
                    minAddPrice:0,
                    endTime:'',
                    point:'',
                    centerPiont:''
                };
            }    
        },
        // currentGround1:function(state){
        //     var res = state.landList.filter(function(item){
        //         return item.id == state.currentGroundID
        //     });
        //     if(res.length>0){
        //         return res[0]
        //     }else{
        //         return {
        //             signId:'',
        //             classify:'',
        //             state:0,
        //             minAddPrice:0,
        //             endTime:''
        //         };
        //     }    
        // },  
        areaIn:function(state){    //是否显示区域
            if(state.sidebars =='01'){
                if(state.groundIn){ //显示地块
                    return false;
                }else{
                    return true;
                }
            }else{
                return false; //不是第一个侧边栏
            }
        }
    },
    mutations:{
        setUser(state,user){
            state.user=user;
        },
        setData(state,payload){
            // debugger;
            state[payload.state]=payload.data
        },
        setGroundShowDetail(state){
            state.groundShowDetail = !state.groundShowDetail
        },
        setEndTime(state,{id,endTime}){
            var indes=-1;
            var land= state.landList.filter(function(item,index){
                if(item.id==id){
                    indes=index;
                }
            });
            if(indes>=0){
                state.landList[indes].endTime=endTime;
            }
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
        setEndTime({commit},payload){
            commit("setEndTime",payload)
        },
        setGroundShowDetail({commit}){
            commit('setGroundShowDetail')
        },
    

        logout({commit}){
            commit("logout");
        }
    }
});