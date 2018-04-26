//import Vue from 'vue';
//import Vuex from 'vuex';
//Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        // user:{
        //     all_ddc:0,
        //     freeze_ddc:0,
        //     enable_ddc:0
        // },
        ctime:null,
        ctimer:0,
        userInfo:{   //用户登录信息
            id:5,
            walletAddr:'',
            token:'',
            loginCount:0,
            allDdc:0,
            ableDdc:0,
            freezeDdc:0,
        },
        sidebars:'01', //{"auction":"01","collection":"02","myGround":"03","record":"04"}
        groundStep:0,  //未开拍0 拍卖中1,  已拍卖2,3
        groundIn:false,  //是否显示地块
        // areaIn:true, //是否显示区域
        areaDatail:{
            lanSum:0,
            unActionCount:0,
            actingCount:0,
            actedCount:0
        }, 
        areaList:[],  
        landList:[],
        landListID:[],

        landListObj:{},
        labelListObj:{},

        recordsID:[],  //存放收藏的ID
        collections:[
            // {land_id:'0xWX4SDFSD1LKH'}
        ],
        records:[
            {land:{},transactionRecord:{}}
        ],
        currentCityID: 0,
        currentAreaID: 0, //当前区域的ID        
        currentGroundID: 0,  //当前地块的ID
        currentCollected:false,

        // currentGroundDetail:{   //当前地块的信息
        //     isCollected:false,
        //     land:{
        //         signId:'',
        //         classify:'',
        //         state:0,
        //         minAddPrice:0,
        //         endTime:'',
        //         point:'',
        //         centerPiont:''
        //     }
        // },
        landIsCollected:false,
        groundShowDetail:true, //是否显示下拉菜单
        // inputPriceCount = 0,  //出价倒计时
    },
    getters: {
        // landIsCollected:function(state,getters){   //当前地块是否收藏
        //     if(getters.currentGround.isCollected) return true;
        //     return false;
        // },
        currentGround:function(state){
            var res = state.landList.filter(function(item){
                return item.id == state.currentGroundID
            });
            if(res.length>0){
                return res[0]
            }else{
                return {
                    addr:"系统账户",
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
        currentRecord:function(state){
            // console.log('records',state.records)
            var res = state.records.filter(function(item){
                return item.land.id == state.currentGroundID
            });
            if(res.length>0){
                return res[0]
            }else{
                return {
                    land:{

                    },
                    transactionRecord:{

                    }
                    // signId:'',
                    // classify:'',
                    // state:0,
                    // minAddPrice:0,
                    // endTime:''
                };
            }    
        },  
        currentPayLoad(state){
            return state.landListObj[state.currentGroundID];
        },
        currentLabel(state){
            return state.labelListObj[state.currentGroundID];
        },
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
        setUserInfo(state,payload){
            state.userInfo=payload;
        },
        setPayLoad(state,list){
            list.forEach(function(item){
                state.landListObj[item.pid]=item;
            })
        },
        setLabel(state,list){
            list.forEach(function(item){
                state.labelListObj[item.pid]=item;
            })
        },
        chageUserInfo(state,payload){   //更改用户信息
            state.userInfo=Object.assign( state.userInfo,payload)
        },
        setCtime(state,payload){
            // clearInterval(state.ctimer)
            state.ctime = payload.time;
            state.ctimer=(new Date()).getTime()
            // state.ctimer=setInterval(()=>{
            //     state.ctime+=1000;    
            // },1000)
            // state.userInfo=payload;
        },
        // setUserInfo
        setData(state,payload){
            // console.log('setData')
            // debugger;
            state[payload.state]=payload.data
        },
        setGroundDetailCollection(state,flag){   //设置地块是否收藏
            // console.log('flag',false)
            getters.currentGround.isCollected=flag;
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
        setPayLoad({commit},payload){
            commit("setPayLoad",payload);
        },
        setCtime({commit},payload){
            commit("setCtime",payload);
        },
        
        setLabel({commit},payload){
            commit("setLabel",payload);
        },
        setUserInfo({commit},payload){
            commit("setUserInfo",payload)
        },
        chageUserInfo({commit},payload){
            commit("chageUserInfo",payload)
        },

        setGroundDetailCollection({commit},payload){
            commit("setGroundDetailCollection",payload)
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