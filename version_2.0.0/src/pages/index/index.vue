<template>
  <div class="wrap"  v-loading="loadingmask"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.3)">
    <Headers ref="refreshDDC">
    </Headers>
    <Sidebar @chageSidebar="chage_sidebar" >
    </Sidebar>
    <div id="allmap">

    </div> 
    <div class="nav">  <!-- 参与拍卖导航 -->
      <div class="nav-left" v-if="$store.state.sidebars =='01'">
        <img src="~assets/icons/icon-area.png">
        <el-select v-model="cvalue" class="select-city" @change="get_map_area_list(cvalue)">
          <el-option v-for="(item) in citys" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <img src="~assets/icons/icon-list-right.png">
        <el-select v-model="avalue" placeholder="请选择" class="select-area" @change="get_map_area_detail(avalue)" >
          <el-option v-for="(item) in areaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <img v-if="false" src="~assets/icons/icon-list-right.png">
        <el-input v-if="false" class="search-map" placeholder="请输入地块编号" v-model="search" clearable></el-input>
      </div>    <!-- 参与拍卖导航结束 -->

      <div  class="nav-left" v-if="$store.state.sidebars=='02'||$store.state.sidebars=='03'||$store.state.sidebars=='04'">
        <img src="~assets/icons/icon-area.png">
        <el-button-group>
          <el-button type="primary" icon="el-icon-arrow-left" @click="prev"></el-button>
          <el-button type="primary" icon="el-icon-arrow-right" @click="next"></el-button>
          
        </el-button-group>
        <div class="hot-land">{{index}}/{{totalIndex}}</div>
      </div>  

      <div  class="nav-left" v-if="$store.state.sidebars =='05'">
        <img src="~assets/icons/icon-area.png">
        <div class="hot-land">纽约</div>
        <img src="~assets/icons/icon-siderbar-e-hover.png" alt="热门地块">
        <div class="hot-land">{{$store.getters.currentGround.markName}}</div>
       </div> <!-- 标志地块 -->

      <template v-if="$store.state.sidebars != '04' && !$store.getters.areaIn">
        <div class="nav-right">
          <li class="step1"></li>
          <li class="step-text">未开拍</li>
          <li class="step2"></li>
          <li class="step-text">拍卖中</li>
          <li class="step3"></li>
          <li class="step-text">待支付</li>
          <li class="step4"></li>
          <li class="step-text">已支付</li>
        </div>
      </template>
      <template v-if="$store.state.sidebars == '04'">
        <div class="nav-right" style="width:258px;">
          <li class="step3"></li>
          <li class="step-text">待支付</li>
          <li class="step4"></li>
          <li class="step-text">已支付</li>
        </div>
      </template>
    </div>
    <AreaIn v-if="$store.state.sidebars=='01' && $store.getters.areaIn" @goGround="get_map_land_list(avalue)"></AreaIn>
    <GroundStep1 ref="getOwner" v-if="!$store.getters.areaIn && $store.state.groundStep==0 && $store.state.sidebars != '04'" 
                @goArea="render_area" 
                @refreshLand="refreshLand1()" 
                :state="$store.state.groundStep" 
                :landid="$store.state.currentGroundID" ></GroundStep1>
    <GroundStep2 ref="currentID" v-if="!$store.getters.areaIn && $store.state.groundStep==1 && $store.state.sidebars != '04'" 
                @goArea="render_area" 
                @refreshLand="refreshLand()" 
                :state="$store.state.groundStep" 
                :landid="$store.state.currentGroundID" 
                :priceList="priceList"  
                @getPrice="get_five_price"
                :PriceLoading="PriceLoading"
                ></GroundStep2>
    <GroundStep3  ref="getOwner2" 
                  v-if="!$store.getters.areaIn && ($store.state.groundStep==3||$store.state.groundStep==2) && $store.state.sidebars != '04'" 
                  @goArea="render_area" 
                  :state="$store.state.groundStep" 
                  :landid="$store.state.currentGroundID" 
                  :priceList="priceList" 
                  @getPrice="get_five_price"
                  :PriceLoading="PriceLoading"
                  ></GroundStep3>

    <Record v-if="$store.state.sidebars =='04'" @renderRecords="chage_sidebar('04')"></Record>
  </div>
</template>

<script>
import Headers from "@/components/header";
import Sidebar from "@/components/sidebar";
import AreaIn from "@/components/AreaIn";
import GroundStep1 from "@/components/GroundStep1";
import GroundStep2 from "@/components/GroundStep2";
import GroundStep3 from "@/components/GroundStep3";
import Record from "@/components/Record";
import { setCookie, getCookie } from "@/util/util";
// import land from '@/store/land'
// import landCenterPoint from '@/store/landCenterPoint'
// import area from '@/store/area'

// var db = new loki("map.json");    //用new loki来创建数据库，使用localStarge来作为底层的数据存储时，loki的参数是localStorage的key的名称
// db.loadDatabase();    //初始化db后，我们调用loadDatabase方法来从localStorage中获取内容
// var citys = db.addCollection("citys")    //为了存储文档，首先要获取集合，用db.addCollection来创建集合
// if (citys == null) {
//     var citys = db.addCollection("citys");
// }

// var coll = db.addCollection("test")    //为了存储文档，首先要获取集合，用db.addCollection来创建集合
// if (coll == null) {
//     var coll = db.addCollection("test");
// }

// coll.insert({ name: "jike", msg: "hello" });        //向集合中插入一个文档，在insert的方法中编写一个js对象
// db.save();    //进行保存
// var list = coll.find({ name: "jike" });    //查找name为jike的文档列表,返回的是对象数组
// console.log(list)
// console.log(ground)
export default {
  name: "index",
  data() {
    return {
      map: null,
      cityAndArea: [],
      citys: [],
      cvalue: 1,
      avalue: 1,
      loadingmask: false,

      areaList: [],
      areaDetail: null,
      landList: [],
      landListID: [],
      currentIndex: 0,
      PriceLoading:false,
      land: [],
      search: "", //搜索框的

      priceList: [],
      noPriceList:'',


      ployStyle: [
        {
          strokeColor: "#f1f1f1",
          fillColor: "#00FFFF",
          strokeWeight: 1,
          strokeOpacity: 0,
          fillOpacity: 0.5
        },
        {
          strokeColor: "#f1f1f1",
          fillColor: "#1253fc",
          strokeWeight: 1,
          strokeOpacity: 0,
          fillOpacity: 0.5
        },
        {
          strokeColor: "#f1f1f1",
          fillColor: "#ff966d",
          strokeWeight: 1,
          strokeOpacity: 0,
          fillOpacity: 0.5
        },
        {
          strokeColor: "#f1f1f1",
          fillColor: "#d572e6",
          strokeWeight: 1,
          strokeOpacity: 0,
          fillOpacity: 0.5
        }
      ],
      ployList: [],
      sidebarActive:"01",
      marker:null,
      index:1,
      totalIndex:0,
    };
  },
   mounted() {
    this.getCtime()
    var user = getCookie("userInfo");
    if (user) {
      user = decodeURIComponent(user);
      var userInfo = JSON.parse(user);
      this.$store.dispatch("setUserInfo", userInfo);
      this.$refs['refreshDDC'].refreshLogin()
      // this.$router.push('/index')
    } else {
      this.$router.push({ path: "/" });
    }
    this.init();
    this.map_init();
    // this.render_map()
    // console.log(this.$store.state.groundStep)
  },
  methods: {
    getCtime(){
      var vthis = this;
      this.$http
        .get("/auction/api/user/nowTime",{timeOut:5000})
        .then(function(res) {
          // console.log("111")
          // console.log(res);
          if (res.data.code == 1) {
            vthis.$store.dispatch("setCtime", {
              time: res.data.data.nowTime
            });
          }else{

          }
          if(call)call();
        })
        .catch(function(err) {
          vthis.loadingmask = false;
        });
        
    },
    init() {
      // this.get_all_city_area()
      // debugger;
      var vthis =this;
      this.loadingmask = true;
      this.get_citys(()=>{
        // debugger;
        this.get_map_area_list(this.$store.state.currentCityID,()=>{
          // debugger;
          this.get_map_area_detail(this.$store.state.currentAreaID,() =>{
            vthis.loadingmask = false;
          });
        });
      });
      
      
    },
    chage_sidebar(sidebars) {
      // var sidebars = this.$store.state.sidebars;
      var vthis = this;
      if (sidebars == "01") {
        this.loadingmask = true;
        this.get_citys(()=>{
          this.get_map_area_list(this.$store.state.currentCityID,()=>{
            this.get_map_area_detail(this.$store.state.currentAreaID,()=>{
              this.$store.dispatch('setData',{state:'sidebars',data:"01"})
              // this.sidebarActive="01";
              vthis.loadingmask = false;
            });
          });
        });
      } else if (sidebars == "02") {
        this.loadingmask = true;
        this.init_clo(() => {
          
          this.loadingmask = false;
        },"02");
      } else if (sidebars == "03") {
        this.loadingmask = true;
        this.init_my_land(() => {
          this.loadingmask = false;
        },"03");
      } else if (sidebars == "04") {
        this.loadingmask = true;
        this.init_record(() => {
          this.loadingmask = false;
        },"04");
      } else if (sidebars == "05"){
        this.loadingmask = true;
        this.init_hot_land(() => {
          this.loadingmask = false;
        },"05");
      }
    },
    get_citys(call) {
      
      var vthis = this;
      this.$http
        .get("/auction/api/city/getAll",{timeOut:5000})
        .then(function(res) {
          // console.log("111")
          // console.log(res);
          if (res.data.code == 1) {
            vthis.citys = res.data.data;
            vthis.$store.dispatch("setData", {
              state: "currentCityID",
              data: res.data.data[0].id
            });
          }
          if(call)call();
        })
        .catch(function(err) {
          vthis.loadingmask = false;
        });
    },
    get_map_area_list(cid=this.$store.state.currentCityID,call) {
      var vthis = this;
      
      this.$http
        .get("/auction/api/region/getByCityId" ,
          {
            params:{
              cityId:cid
            },
            timeOut:5000
          }
        )
        .then(function(res) {
          // console.log("222")
          // console.log(res);
          if (res.data.code == 1) {
            vthis.areaList = res.data.data;
            vthis.$store.dispatch("setData", {
              state: "areaList",
              data: res.data.data
            });
            vthis.avalue = res.data.data[0].id;
            // console.log(vthis.areaList)
            vthis.$store.dispatch("setData", {
              state: "currentAreaID",
              data: vthis.avalue
            });
          }
           if(call)call();
           vthis.loadingmask = false;
        })
        .catch(function(err) {
          vthis.loadingmask = false;
          // vthis.$message({
          //   showClose: true,
          //   message: '抱歉,数据加载失败,刷新试试?',
          //   type: 'error'
          // });
        });
    },
    get_map_area_detail(aid=this.$store.state.currentAreaID,callback) {
      var vthis = this;
      this.loadingmask = true;
      // debugger;
      this.$http
        .get("/auction/api/region/getDetail",
          {
            params:{
              regionId:aid
            },
            timeOut:5000
          }
        )
        .then(function(res) {
          //  console.log("333")
          // console.log(res);
            if(res.data.code == 1){
              vthis.areaDetail = res.data.data;
              // console.log(vthis.land)
              vthis.$store.dispatch("setData", {
                state: "areaDatail",
                data: res.data.data
              });
              vthis.render_area();
            }
            vthis.loadingmask = false;
            if (callback) callback();
          })
           .catch(function(err) {
          // this.loadingmask = true;
          if (callback) callback();
          vthis.loadingmask = false;
          // vthis.$message({
          //   showClose: true,
          //   message: err.message,
          //   type: 'error'
          // });
        });
    },
    get_map_land_list(aid = this.$store.state.currentAreaID, callbank) {
      // debugger;
      // console.log(aid)
      var vthis = this;
      this.loadingmask = true;
      this.$http
        .get("/auction/api/land/getByRegionId",
          {
            params:{
              regionId:aid
            },
            timeOut:5000
          }
        )
        .then(function(res) {
          if (res.data.code == 1) {

            // debugger;
            res.data.data = res.data.data.map(function(item) {
              var startTime = new Date(item.land.startTime);
              var now = new Date();
              if(vthis.$store.state.ctime){   //与服务器时间对比
                now=new Date(vthis.$store.state.ctime);
              }

              if (startTime < now && item.land.state == 0) {
                item.land.oldState=item.land.state;
                item.land.state = 1;
              }
              // debugger;
              if ( item.land.endTime&&( item.land.state == 1||item.land.state == 0)) {
                
                var end = new Date(item.land.endTime);
                if (end < now) {
                  item.land.oldState=item.land.state;
                  item.land.state = 2;
                }
              }
              return item;
            });
            vthis.landList = res.data.data.map(function(itme) {
              var ele = itme.land;
              if (itme.addr) {
                ele.addr = itme.addr;
              }
              return ele;
            });
            // console.log('landList',vthis.landList)
            vthis.$store.dispatch("setData", {
              state: "currentGroundID",
              data: res.data.data[0].land.id
            });
            // console.log('$store',res.data.data[0].id)
            // vthis.$store.state.currentGroundID
            vthis.$store.dispatch("setData", {
              state: "landList",
              data: vthis.landList
            });
            vthis.paint_land();
            if (callbank) callbank();
          }else{
              vthis.$message({
              showClose: true,
              message: '该区域暂无地块划分',
              type: 'error'
            });
          }
          vthis.loadingmask = false;
        })
        .catch(function(err) {
          vthis.loadingmask = false;
          // vthis.$message
          // vthis.$message({
          //   showClose: true,
          //   message: '抱歉,数据加载失败,刷新试试?',
          //   type: 'error'
          // });
        });
    },
    chageGroundStep: function(msg) {
      // console.log('msg',msg)
      this.$store.dispatch("setData", { state: "groundIn", data: true });
      this.$store.dispatch("setData", { state: "groundStep", data: msg });
    },
    goGround: function(data) {
      this.get_map_land_list(this.$store.state.currentAreaID, () => {
        this.$store.dispatch("setData", { state: "groundIn", data: true });
      });
      // this.paint_land()
    },
    map_init: function() {
      var vthis = this;
      var map = new BMap.Map("allmap", { enableMapClick: false });
      vthis.map = map;
      map.enableScrollWheelZoom(true);
      //添加缩略图
      var overViewOpen = new BMap.OverviewMapControl({
        isOpen: true,
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT
      });
      map.addControl(overViewOpen); //右下角，打开
      map.setMapStyle({
        styleJson:[
                          {
                                    "featureType": "railway",
                                    "elementType": "all",
                                    "stylers": {
                                              "visibility": "off"
                                    }
                          },
                          {
                                    "featureType": "subway",
                                    "elementType": "all",
                                    "stylers": {
                                              "visibility": "off"
                                    }
                          }
                ]
      });
    },
    render_area() {
      if (this.areaDetail) {
        // console.log(111)
        this.$store.state.groundIn = false;
        this.map.clearOverlays();
        //覆盖物样式
        var areaArr = this.areaDetail.region.point.split("|");
        // for(var i=0; i<area.length; i++){
        var pointS = areaArr.map(function(item) {
          // console.log(item);
          item = item.split(",");
          return new BMap.Point(parseFloat(item[0]), parseFloat(item[1]));
        });
        var style2 = {
          strokeColor: "#f1f1f1",
          fillColor: "#8B008B",
          strokeWeight: 1,
          strokeOpacity: 0,
          fillOpacity: 0.5
        }
        var area1 = new BMap.Polygon(pointS, style2);
        this.map.addOverlay(area1);

        var areaC = this.areaDetail.region.centerPoint.split(",");
        var areaCP = new BMap.Point(parseFloat(areaC[0]), parseFloat(areaC[1]));
        var marker = new BMap.Marker(areaCP);
        this.map.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        this.map.centerAndZoom(areaCP, 15);
        this.map.setMinZoom(14)
        this.map.setMaxZoom(17)
        this.map.setZoom(15)
      }
    },
    paint_land: function() {
      // this.loadingmask =true;
      // debugger;
      // console.log('landList',this.landList)
      
      if (this.landList) {
          this.render_land(this.landList)
        }
    },
    get_land_detail(lid = this.$store.state.currentGroundID,call) {
      // console.log('lid',lid)
      var vthis = this;
      // debugger;
      this.$http
        .get(
          "/auction/api/land/getByLandId" ,
          {
            params:{
              landId:lid,
              userId:this.$store.state.userInfo.id
            },
            timeOut:5000
          }
        )
        .then(function(res) {
            if(call){
              call(res.data);
            }
          if (res.data.code == 1) {
            // console.log('getByLandId',res.data)
            // debugger;
            vthis.$store.dispatch("setData", {
              state: "landIsCollected",
              data: res.data.data.isCollected
            });
            var item=res.data.data.land;
            var startTime = new Date(item.startTime);
            var now = new Date();
              if(vthis.$store.state.ctime){   //与服务器时间对比
                now=new Date(vthis.$store.state.ctime);
              }
              if (startTime < now && item.state == 0) {
                item.oldState=item.state;
                item.state = 1;
              }
              if (item.endTime&&( item.state == 1||item.state == 0)) {
                var end = new Date(item.endTime);
                if (end < now) {
                  item.oldState=item.state;
                  item.state = 2;
                }
              }
              vthis.$store.dispatch("setCurrentland",{id:item.id,data:item})


            // console.log('地块详情:',res.data.data)
            // vthis.$store.dispatch('setData',{state:'currentGroundDetail',data:res.data.data.land})
          }
        })
        .catch(function(err) {
          // debugger;
          console.error(err);
          vthis.loadingmask = false;
          vthis.$message({
            showClose: true,
            message: '抱歉,数据加载失败,刷新试试?',
            type: 'error'
          });
        });
    },
    get_five_price() {
      
      this.PriceLoading=true;
      var priceList2= this.priceList;
      this.priceList = [];
      this.$http
        .get(
          "/auction/api/priceRecord/getPriceRecord" ,
          {
                params:{
                  landId:this.$store.state.currentGroundID
                },
                timeOut:5000
              }
        )
        .then(res => {
          // console.log(res);
          this.loadingmask =false;
          this.PriceLoading=false;
          if (res.data.code == 1) {
            
            this.priceList = res.data.data;
            
          } else {
            this.priceList=[]
            // console.log(1111)
            
          }
        })
        .catch(err => {
          this.loadingmask =false;
          this.PriceLoading=false;
          console.log(err);
           this.priceList = priceList2;
        });
        this.refreshLand()
    },

    /**
     * 渲染地块
     * @param {Array<{state:number,id:number,startPrice:number,centerPoint:string,point:string,topPrice:number|null}>} landList
     * @param {string} sidebar
     */
    render_land(landList,sidebar) {
            var vthis = this;
            if(sidebar){  //侧边栏跳转
               this.$store.dispatch('setData',{state:'sidebars',data:sidebar})
            }   
            console.log('landList',landList)
            if (landList) {
              this.totalIndex =landList.length; //总的地块数
              this.index = 1
              this.$store.dispatch("setData", {  //保存landList
                state: "landList",
                data:landList
              });                                      //当前的地块索引

              this.$store.dispatch("setData", {        //设置当前地块ID
                state: "currentGroundID", 
                data: landList[0].id
              });
              this.get_land_detail(landList[0].id);
              //获取五条出价记录
              if(landList[0].state != 0){
                this.get_five_price();
              }
              this.chageGroundStep(landList[0].state);   //根据状态切换组件
              // debugger;
              var map = this.map;
              map.clearOverlays();
              map.setMinZoom(17)
              map.setMaxZoom(19)

              // //默认地块标注
              var markerP = landList[0].centerPoint.split(",");
              var cp = new BMap.Point( parseFloat(markerP[0]), parseFloat(markerP[1]) );
              var marker = new BMap.Marker(cp); // 创建标注;
              map.addOverlay(marker);
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
              this.marker = marker
              map.centerAndZoom(cp, 17);
              // this.chageGroundStep(this.$store.state.landList[0].state);
              // if(this.$refs.getOwner){
              // }
              //添加覆盖物
              var PayloadList = [];
              var labelList=[];
              for (let i = 0; i < landList.length; i++) {
                var item = landList[i];
                var ployArr = item.point.split("|"); //  ['1232,2323','1212,56666']
                var pointS = [];
                pointS = ployArr.map(function(it) {
                  it = it.split(",");
                  return new BMap.Point(
                    parseFloat(it[0]),
                    parseFloat(it[1])
                  );
                });
                var style=this.ployStyle[item.state];
                
                var polygon = new BMap.Polygon( pointS,style);
                polygon.pid = item.id;
                polygon.state = item.state;
                map.addOverlay(polygon);
                
                // debugger;
                //添加文本标注 ------------------------
                var piontCen = item.centerPoint.split(",");
                var piontCenter = new BMap.Point(
                    parseFloat(piontCen[0]),
                    parseFloat(piontCen[1])
                );
                var opts = {
                    position: piontCenter, // 指定文本标注所在的地理位置
                    offset: new BMap.Size(-20, 0) //设置文本偏移量
                };
                var labStyle = {
                    color: "#ffffff",
                    fontSize: "12px",
                    height: "20px",
                    lineHeight: "20px",
                    fontFamily: "微软雅黑"
                  }

                if(item.topPrice){
                  var label = new BMap.Label(
                    parseInt(item.topPrice / 1000) + "k",
                    opts
                  ); // 创建文本标注对象
                  label.setStyle(labStyle);
                  label.pid =item.id;
                  map.addOverlay(label);
                  labelList.push(label);
                }else if(item.price){
                  var label = new BMap.Label(
                    parseInt(item.price / 1000) + "k",
                    opts
                  ); // 创建文本标注对象
                  label.setStyle(labStyle);
                  label.pid = item.id;
                  map.addOverlay(label);
                  labelList.push(label);
                }else if(item.startPrice){
                  var label = new BMap.Label(
                    parseInt(item.startPrice / 1000) + "k",
                    opts
                  ); // 创建文本标注对象
                  label.setStyle(labStyle);
                  label.pid = item.id;
                  map.addOverlay(label);
                  labelList.push(label);
                }

                //绑定覆盖物点击事件
                polygon.addEventListener("click", function(e){
                  // vthis.get_land_detail(this.pid);
                  // console.log('currentID',this.$store.state.currentGroundID)
                  // vthis.chageGroundStep(this.state);
                  // debugger;
                  
                  vthis.$store.dispatch("setData", {
                    state: "currentGroundID",
                    data: this.pid
                  });

                  // vthis.refreshLand(this.pid)
                  // debugger;
                  var land=vthis.$store.getters.currentGround.state;
                  if (land==1 ||land==2||land==3) {
                    console.log('get_five_price')
                    vthis.get_five_price();
                  }else if(land==0){
                    vthis.refreshLand()
                  }

                  //创建小红点标注
                  var lan = vthis.$store.getters.currentGround.centerPoint.split(",");
                  var lanCP = new BMap.Point(parseFloat(lan[0]), parseFloat(lan[1]))
                  if (vthis.marker) {
                      vthis.marker.setPosition(lanCP);
                  }else{
                      vthis.marker = new BMap.Marker(lanCP)
                      map.addOverlay(marker);
                      vthis.marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                  }
                  // vthis.loadingmask = false;

                });  //------覆盖物点击事件结束--------
                // console.log("AddPayLoad")
                PayloadList.push(polygon);
              }  //-----循环绘制覆盖物结束--------
              
              this.$store.dispatch("setLabel",labelList);
              this.$store.dispatch("setPayLoad", PayloadList);
            }
       
    },
    
    init_clo(callback,sidebar) {
      this.$http
        .get(
          "/auction/api/collect/getAllCollectLand",
          {
            params:{
              userId:this.$store.state.userInfo.id
            },
            timeOut:5000
          }
        )
        .then((res) => {
          if (res.data.code == 1) {
            // vthis.sidebarActive="02";
            var landList = res.data.data.map((item) => {
              var startTime = new Date(item.land.startTime);
              var now = new Date();
              if(this.$store.state.ctime){   //与服务器时间对比
                now=new Date(this.$store.state.ctime);
              }
              if (startTime < now && item.land.state == 0) {
                item.land.oldState=item.land.state;
                item.land.state = 1;
              }
              if (item.land.endTime&&( item.land.state == 1||item.land.state == 0)) {
                var end = new Date(item.land.endTime);
                if (end < now) {
                  item.land.oldState=item.land.state;
                  item.land.state = 2;
                }
              }
              item.land.cityName = item.cityName;
              item.land.regionName = item.regionName;
              item.land.addr = item.addr;
              item.land.isCollected=true;
              return item.land;
            });

            if(sidebar == "02"){
              this.render_land(landList,"02")
            }else{
              this.render_land(landList)
            }
          }else{
            this.$message({
              showClose: true,
              message: "您暂时没有收藏记录哦!",
              type: "error"
            });
          }
          if (callback) callback();
        })
        .catch((err) =>{
          if (callback) callback();
        });
      // console.log(vthis.$store.getters.currentGround)
    },
    init_my_land(callback,sidebar) {
      this.$http
        .get(
          "/auction/api/land/getUserAllLand",
          {
            params:{
              userId:this.$store.state.userInfo.id
            },
            timeOut:5000
          }
        )
        .then((res) => {
          if (res.data.code == 1) {
            //"03"
            var landList = res.data.data.map((item)=> {
                item.land.cityName = item.cityName;
                item.land.regionName = item.regionName;
                item.land.addr = item.addr;
                return item.land;
              })
            if(sidebar == "03"){
              this.render_land(landList,"03")
            }else{
              this.render_land(landList)
            }
          } else {
            this.$message({
              showClose: true,
              message: "您暂时还没有地块!",
              type: "error"
            });
          }
          if (callback) callback();
        })
        .catch((err) => {
          if (callback) callback();
          this.$message({
            showClose: true,
            message: '抱歉,数据加载失败,刷新试试?',
            type: "error"
          });
        });
    },
    init_record(callback,sidebar) {
      var vthis = this
      this.$http
        .get(
          "/auction/api/transaction/getInnerTransactionRecord" ,
          {
            params:{
              userId:this.$store.state.userInfo.id
            },
            timeOut:5000
          }
        )
        .then((res) => {
          if (res.data.code == 1) {
            // console.log(1111,res.data)
            // vthis.$store.dispatch('setData',{state:'sidebars',data:"04"})
            var landList = res.data.data.map((item)=> {
              item.land.cityName = item.cityName;
              item.land.regionName = item.regionName;
              item.land.transactionRecord = item.transactionRecord;
              return item.land;
            })
            if(sidebar == "04"){
              this.render_land(landList,"04")
            }else{
              this.render_land(landList)
            }
          } else {
            vthis.$message({
              showClose: true,
              message: "您暂时还没有订单记录!",
              type: "error"
            });
          }

          if (callback) callback();
        })
        .catch((err) => {
          if (callback) callback();
          vthis.$message({
            showClose: true,
            message: '抱歉,数据加载失败,刷新试试?',
            type: 'error'
          });
        });
    },
    init_hot_land(callback,sidebar) {
      this.$http
        .get("/auction/api/land/getByMark?isMark=2" ,{timeOut:5000})
        .then((res) => {
          if (res.data.code == 1) {
             //sidebars 05
            var landList = res.data.data.map((item) => {
              var startTime = new Date(item.startTime);
              var now = new Date();
              if(this.$store.state.ctime){
                var localNow = (new Date).getTime()
                if(localNow>this.$store.state.ctimer){
                  var diff = localNow-this.$store.state.ctimer
                  now=new Date(this.$store.state.ctime+diff);
                }
              }
              if (startTime < now && item.state == 0) {
                item.oldState=item.state;
                item.state = 1;
              }
              if (item.endTime &&( item.state == 1||item.state == 0)) {
                var end = new Date(item.endTime);
                if (end < now) {
                  item.oldState=item.state;
                  item.state = 2;
                }
              }
              return item;
            });
            if(sidebar == "05"){
              this.render_land(landList,"05")
            }else{
              this.render_land(landList)
            }       
            this.map.setMinZoom(18)
            this.map.setMaxZoom(19)
            this.map.setZoom(18)
          } else {
            this.$message({
              showClose: true,
              message: "您暂时还没有地块!"
            });
          }
          if (callback) callback();
        })
        .catch((err) => {
          if (callback) callback();
          // console.log(err)
        });
    },

    prev() {
      //this.$store.getters.currentGround;
      // this.$store.state.currentGroundID;
      // vthis.refreshLand(this.pid)
      var index=-1;
      this.$store.state.landList.forEach((item,inde)=>{
        if(item.id== this.$store.state.currentGroundID){
          index=inde;
        }
      });
      
      if(index>=0){
            index--;
            if(index<0){
                index= this.$store.state.landList.length-1;
            }  
            var prevLand= this.$store.state.landList[index];
            this.$store.dispatch('setData',{state:'currentGroundID',data:prevLand.id});

            var land=this.$store.getters.currentGround.state;
                  if (land==1||land==2||land==3) {
                    console.log('get_five_price')
                    this.get_five_price();
                  }
            var centers=prevLand.centerPoint.split(",");

            var point=new BMap.Point(parseFloat( centers[0]),parseFloat(centers[1]));
            this.map.setCenter(point);
            if (this.marker) {
                this.marker.setPosition(point);
            }
            // this.marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      }     

      this.index = index+1;
      this.totalIndex = this.$store.state.landList.length;

      // $store.dispatch('setData',{state:'currentGroundID',data:})
    },
    next() {
      var index=-1;
      this.$store.state.landList.forEach((item,inde)=>{
        if(item.id== this.$store.state.currentGroundID){
          index=inde;
        }
      });
      if(index>=0){
        // debugger;
            index++;

            if(index==this.$store.state.landList.length){
              index = 0;
            } 
            var prevLand= this.$store.state.landList[index];
            this.$store.dispatch('setData',{state:'currentGroundID',data:prevLand.id});

            var land=this.$store.getters.currentGround.state;
                  if (land==1||land==2||land==3) {
                    console.log('get_five_price')
                    this.get_five_price();
                  }

            var centers=prevLand.centerPoint.split(",");

            var point=new BMap.Point(parseFloat( centers[0]),parseFloat(centers[1]));
            this.map.setCenter(point);
            if (this.marker) {
                this.marker.setPosition(point);
            }
          
      } 
      
      this.index = index+1;
      this.totalIndex = this.$store.state.landList.length;
    },
    // refreshAll(){
    //   var sidebar = this.$store.state.sidebars
    //   this.chage_sidebar(sidebar)
    // },
    refreshLand(){
      // debugger;
      this.loadingmask = true;
      var id=this.$store.state.currentGroundID;
    
      var vthis=this;
      this.get_land_detail(id,( data) =>{
        this.loadingmask = false;
        // console.log(data);
        if(data.code==1){
          var land=data.data.land;
          land.isCollected=data.data.isCollected;

          var startTime = new Date(land.startTime);
          var now = new Date();
          if(this.$store.state.ctime){
            var localNow = (new Date).getTime()
            if(localNow>this.$store.state.ctimer){
              var diff = localNow-this.$store.state.ctimer
              now=new Date(this.$store.state.ctime+diff);
            }
          }
          if (startTime < now && land.state == 0) {
            land.state = 1;
          }
          if (land.endTime &&( land.state == 1||land.state == 0)) {
            var end = new Date(land.endTime);
            if (end < now) {
              land.state = 2;
            }
            
          }
          // debugger;
          this.chageGroundStep(land.state);

          var plo = this.$store.state.landListObj[id];
          if(plo){
            plo.setFillColor(this.ployStyle[land.state].fillColor)
          }
          if(land.topPrice){
           this.$store.state.labelListObj[id].setContent(parseInt(land.topPrice/1000)+'k')
          }
          vthis.$store.dispatch("setCurrentland",{id:id,data:land})
          // console.log("DisPath");
          // vthis.get_five_price()
        }else{

        }
        this.loadingmask = false;
      })
    },
    
     refreshLand1(){
      this.loadingmask = true;
      var id=this.$store.state.currentGroundID;
    
      var vthis=this;
      this.get_land_detail(id,( data) =>{
        this.loadingmask = false;
        // console.log(data);
        if(data.code==1){
          var land=data.data.land;
          land.isCollected=data.data.isCollected;

          var startTime = new Date(land.startTime);
          var now = new Date();
          if(this.$store.state.ctime){
            var localNow = (new Date).getTime()
            if(localNow>this.$store.state.ctimer){
              var diff = localNow-this.$store.state.ctimer
              now=new Date(this.$store.state.ctime+diff);
            }
          }
          if (startTime < now && land.state == 0) {
            land.oldState=land.state;
            land.state = 1;
          }
          if (land.endTime &&( land.state == 1||land.state == 0)) {
            var end = new Date(land.endTime);
            if (end < now) {
              land.oldState=land.state
              land.state = 2;
            }
            
          }
          // debugger;
          this.chageGroundStep(land.state);
          //this.$store.dispatch("setData", {state:"currentGroundID",data:0 });
          this.$store.dispatch("setCurrentland", {id:id, data: land });
          var plo = this.$store.state.landListObj[id];
          if(plo){
            plo.setFillColor(this.ployStyle[land.state].fillColor)
          }
          if(land.topPrice){
           this.$store.state.labelListObj[id].setContent(parseInt(land.topPrice/1000)+'k')
          }
          vthis.$store.dispatch("setCurrentland",{id:id,data:land})

          // console.log("DisPath");
          vthis.get_five_price()
        }else{

        }
        this.loadingmask = false;
      })
    }
  },
  // updated(){
  //   console.log('store',this.$store.state);
  // },
 
  components: {
    Headers,
    Sidebar,
    AreaIn,
    GroundStep1,
    GroundStep2,
    GroundStep3,
    Record
  }
};
</script>

<style scoped>

</style> 


