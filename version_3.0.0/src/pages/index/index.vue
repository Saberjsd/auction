<template>
  <div class="wrap"  v-loading="loadingmask"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.3)">
    <Headers>
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
          <li class="step-text">已拍完</li>
        </div>
      </template>
      <template v-if="$store.state.sidebars == '04'">
        <div class="nav-right">
          <li class="paying"></li>
          <li class="step-text">待支付</li>
          <li class="payed"></li>
          <li class="step-text">已支付</li>
        </div>
      </template>
    </div>
    <AreaIn v-if="$store.state.sidebars=='01' && $store.getters.areaIn" @goGround="get_map_land_list(avalue)"></AreaIn>
    <GroundStep1 ref="getOwner" v-if="!$store.getters.areaIn && $store.state.groundStep==0 && $store.state.sidebars != '04'" @goArea="render_area" @refreshHot="init_hot_land()" :state="$store.state.groundStep" :landid="$store.state.currentGroundID"></GroundStep1>
    <GroundStep2 ref="currentID" v-if="!$store.getters.areaIn && $store.state.groundStep==1 && $store.state.sidebars != '04'" @goArea="render_area" @refreshHot="init_hot_land()" :state="$store.state.groundStep" :landid="$store.state.currentGroundID"></GroundStep2>
    <GroundStep3 ref="getOwner2" v-if="!$store.getters.areaIn && ($store.state.groundStep==3||$store.state.groundStep==2) && $store.state.sidebars != '04'" @goArea="render_area" :state="$store.state.groundStep" :landid="$store.state.currentGroundID"></GroundStep3>

    <Record v-if="$store.state.sidebars =='04'" @renderRecords="init_record()"></Record>
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

      land: [],
      search: "", //搜索框的
      priceList: [],
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
          fillColor: "#ff966d",
          strokeWeight: 1,
          strokeOpacity: 0,
          fillOpacity: 0.5
        }
      ],
      ployList: [],
      sidebarActive:"01",
    };
  },
   mounted() {
    this.getCtime()
    var user = getCookie("userInfo");
    if (user) {
      user = decodeURIComponent(user);
      var userInfo = JSON.parse(user);
      this.$store.dispatch("setUserInfo", userInfo);
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
          if (res.data.code) {
            vthis.$store.dispatch("setCtime", {
              time: res.data.data.nowTime
            });
          }else{

          }
          if(call)call();
        })
        .catch(function(err) {
          
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
        });
      } else if (sidebars == "03") {
        this.loadingmask = true;
        this.init_my_land(() => {
          this.loadingmask = false;
        });
      } else if (sidebars == "04") {
        this.loadingmask = true;
        this.init_record(() => {
          this.loadingmask = false;
        });
      } else if (sidebars == "05"){
        this.loadingmask = true;
        this.init_hot_land(() => {
          this.loadingmask = false;
        });
      }
    },
    get_citys(call) {
      
      var vthis = this;
      this.$http
        .get("/auction/api/city/getAll",{timeOut:5000})
        .then(function(res) {
          // console.log("111")
          // console.log(res);
          if (res.data.code) {
            vthis.citys = res.data.data;
            vthis.$store.dispatch("setData", {
              state: "currentCityID",
              data: res.data.data[0].id
            });
          }
          if(call)call();
        })
        .catch(function(err) {
          
        });
    },
    get_map_area_list(cid=this.$store.state.currentCityID,call) {
      var vthis = this;
      
      this.$http
        .get("/auction/api/region/getByCityId/" +cid,{timeOut:5000})
        .then(function(res) {
          // console.log("222")
          // console.log(res);
          if (res.data.code) {
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
        })
        .catch(function(err) {
          vthis.$message({
            showClose: true,
            message: '抱歉,数据加载失败,刷新试试?',
            type: 'error'
          });
        });
    },
    get_map_area_detail(aid=this.$store.state.currentAreaID,callback) {
      var vthis = this;
      this.loadingmask = true;
      // debugger;
      this.$http
        .get("/auction/api/region/getDetail/" + aid,{timeOut:5000})
        .then(function(res) {
          //  console.log("333")
          // console.log(res);
            if(res.data.code){
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
          vthis.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          });
        });
    },
    get_map_land_list(aid = this.$store.state.currentAreaID, callbank) {
      // debugger;
      // console.log(aid)
      var vthis = this;
      this.loadingmask = true;
      this.$http
        .get("/auction/api/land/getByRegionId/" + aid,{timeOut:5000})
        .then(function(res) {
          if (res.data.code) {

            // debugger;
            res.data.data = res.data.data.map(function(item) {
              var startTime = new Date(item.land.startTime);
              var now = new Date();
              if(vthis.$store.state.ctime){   //与服务器时间对比
                now=new Date(vthis.$store.state.ctime);
              }

              if (startTime < now && item.land.state == 0) {
                item.land.state = 1;
              }
              if (item.land.endTime) {
                var end = new Date(item.land.endTime);
                if (end < now) {
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
      }
    },
    paint_land: function() {
      var vthis = this;
      // this.loadingmask =true;
      // debugger;
      if (vthis.landList) {
        var map = vthis.map;
        
        // map.setMaxZoom(17)
        // console.log(map)
        map.clearOverlays();
        // //默认地块标注
        this.get_land_detail(this.landList[0].id);

        var markerP = vthis.landList[0].centerPoint.split(",");
        var cp = new BMap.Point(parseFloat(markerP[0]), parseFloat(markerP[1]));
        var marker = new BMap.Marker(cp); // 创建标注;
        map.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

        map.centerAndZoom(cp, 17);
        map.setMinZoom(15)
        map.setMaxZoom(19)
        vthis.chageGroundStep(vthis.landList[0].state);
        //添加覆盖物
        var PayloadList = [];
        var labelList = [];
        for (let i = 0; i < vthis.landList.length; i++) {
          var ployArr = vthis.landList[i].point.split("|"); //  ['1232,2323','1212,56666']
          var pointS = [];
          pointS = ployArr.map(function(item) {
            // console.log(item);
            item = item.split(",");
            return new BMap.Point(parseFloat(item[0]), parseFloat(item[1]));
          });
          // console.log(vthis.landList[i].state)
          var polygon = new BMap.Polygon(
            pointS,
            this.ployStyle[vthis.landList[i].state]
          );
          polygon.pid = vthis.landList[i].id;
          polygon.state = vthis.landList[i].state;
          map.addOverlay(polygon);
          if (vthis.landList[i].state == 1) {
            var piontCen = vthis.landList[i].centerPoint.split(",");
            var piontCenter = new BMap.Point(
              parseFloat(piontCen[0]),
              parseFloat(piontCen[1])
            );
            var opts = {
              position: piontCenter, // 指定文本标注所在的地理位置
              offset: new BMap.Size(-20, 0) //设置文本偏移量
            };
            var label = new BMap.Label(
              vthis.landList[i].topPrice / 1000 + "k",
              opts
            ); // 创建文本标注对象
            label.setStyle({
              color: "#ffffff",
              fontSize: "12px",
              height: "20px",
              lineHeight: "20px",
              fontFamily: "微软雅黑"
            });
            label.pid = vthis.landList[i].id;
            map.addOverlay(label);
            labelList.push(label);
          }
          //绑定覆盖物点击事件
          polygon.addEventListener("click", function(e) {
            var id = this.pid;
            // console.log('currentID',vthis.$store.state.currentGroundID)
            vthis.get_land_detail(this.pid);
            // console.log('点击事件中的id',this.pid)
            vthis.chageGroundStep(this.state);
            // debugger;
            vthis.$store.dispatch("setData", {
              state: "currentGroundID",
              data: this.pid
            });
            //
            var detail = vthis.$store.state.landList.filter(function(item) {
              return item.id == id;
            });
            // console.log("findDetial",detail);
            if (detail) {
              // vthis.$store.dispatch('setData',{state:'currentGroundDetail',data:detail[0]});
            }

            vthis.$store.dispatch("setData", {
              state: "currentCollected",
              data: this.pid
            });

            if (
              vthis.$store.state.groundStep == 1 &&
              vthis.$refs["currentID"]
            ) {
              // console.log('ref',vthis.$refs)
              // debugger;
              vthis.$refs["currentID"].priceList = [];
              vthis.$refs["currentID"].get_five_price(this.pid);
            }
            //创建小红点标注
            if (marker) {
              map.removeOverlay(marker);
            }
            // if(this.status == 1){
            //   vthis.$store.state.currentGroundID = '0xWX4SDFSD1LKH';
            // }else{
            //   vthis.$store.state.currentGroundID = '0xWX4EYEFP1BHQ';
            // }
            // console.log(this.pid)
            var land = vthis.landList.filter(item => {
              return item.id == this.pid;
            });
            var lan = land[0].centerPoint.split(",");
            // console.log(lan)
            marker = new BMap.Marker(
              new BMap.Point(parseFloat(lan[0]), parseFloat(lan[1]))
            ); // 创建标注
            map.addOverlay(marker);
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            // var label = new BMap.Label(vthis.landList[i].topPrice/10000+'万',{offset:new BMap.Size(20,-10)});
            // marker.setLabel(label);
          });

          PayloadList.push(polygon);
        }
        this.$store.dispatch("setLabel", labelList);
        this.$store.dispatch("setPayLoad", PayloadList);

        // vthis.chageGroundStep();
      }
    },
    get_land_detail(lid = this.$store.state.currentGroundID) {
      // console.log('lid',lid)
      var vthis = this;
      // debugger;
      this.$http
        .get(
          "/auction/api/land/getByLandId/" +
            lid +
            "/" +
            this.$store.state.userInfo.id,{timeOut:5000}
        )
        .then(function(res) {
          if (res.data.code) {
            // console.log('getByLandId',res.data)
            // debugger;
            vthis.$store.dispatch("setData", {
              state: "landIsCollected",
              data: res.data.data.isCollected
            });

            // console.log('地块详情:',res.data.data)
            // vthis.$store.dispatch('setData',{state:'currentGroundDetail',data:res.data.data.land})
          }
        })
        .catch(function(err) {
          vthis.$message({
            showClose: true,
            message: '抱歉,数据加载失败,刷新试试?',
            type: 'error'
          });
        });
    },
    render_land: function(landList) {
      var vthis = this;
      if (landList) {
        var map = this.map;
        map.clearOverlays();
        //默认地块标注
        var markerP = landList[0].centerPoint.split(",");
        var cp = new BMap.Point(parseFloat(markerP[0]), parseFloat(markerP[1]));
        var marker = new BMap.Marker(cp); // 创建标注;
        map.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        map.centerAndZoom(cp, 17);
        this.chageGroundStep(landList[0].state);
        //添加覆盖物
        for (let i = 0; i < landList.length; i++) {
          var ployArr = landList[i].point.split("|"); //  ['1232,2323','1212,56666']
          var pointS = [];
          pointS = ployArr.map(function(item) {
            // console.log(item);
            item = item.split(",");
            return new BMap.Point(parseFloat(item[0]), parseFloat(item[1]));
          });
          // console.log(landList[i].state)
          var polygon = new BMap.Polygon(
            pointS,
            this.ployStyle[landList[i].state]
          );
          polygon.pid = landList[i].id;
          polygon.state = landList[i].state;
          map.addOverlay(polygon);
          //绑定覆盖物点击事件
          polygon.addEventListener("click", function(e) {
            vthis.chageGroundStep(this.state);
            vthis.$store.dispatch("setData", {
              state: "currentGroundID",
              data: this.pid
            });
            if (
              vthis.$store.state.groundStep == 1 &&
              vthis.$refs["currentID"]
            ) {
              vthis.$refs["currentID"].priceList = [];
              vthis.$refs["currentID"].get_five_price(this.pid);
            }
            //创建小红点标注
            if (marker) {
              map.removeOverlay(marker);
            }
            var land = landList.filter(item => {
              return item.id == this.pid;
            });
            var lan = land[0].centerPoint.split(",");
            marker = new BMap.Marker(
              new BMap.Point(parseFloat(lan[0]), parseFloat(lan[1]))
            ); // 创建标注
            map.addOverlay(marker);
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
          });
        }
      }
    },

    prev() {
      // this.$store.getters.currentGround;
      // // this.$store.state.currentGroundID;
      // debugger;
      // var index=-1;
      // this.$store.state.landList.forEach((item,inde)=>{
      //   if(item.id== this.$store.state.currentGroundID){
      //     index=inde;
      //   }
      // });
      

      // if(index>=0){
      //       index--;
      //       if(index<0){
      //           index= this.$store.state.landList.length-1;

      //       }  
      //       var prevLand= this.$store.state.landList[index];
      //       this.$store.dispatch('setData',{state:'currentGroundID',data:prevLand.id});
      //       var centers=prevLand.centerPoint.split(",");

      //       var point=new BMap.Point(parseFloat( centers[0]),parseFloat(centers[1]));
      //       this.map.centerAndZoom(point);
      // }     


      // $store.dispatch('setData',{state:'currentGroundID',data:})
    },
    next() {
      // this.currentIndex++;
      // this.$store.dispatch("setData", {
      //   state: "currentGroundID",
      //   data: this.landListID[this.currentIndex]
      // });
      // if (this.currentIndex >= this.landListID.length) {
      //   this.currentIndex = 0;
      // }
      // debugger;
      // var index=-1;
      // this.$store.state.landList.forEach((item,inde)=>{
      //   if(item.id== this.$store.state.currentGroundID){
      //     index=inde;
      //   }
      // });
      
 
      // if(index>=0){
      //       index++;
      //       if(index==this.$store.state.landList.length-1){
      //         index= 0;

      //       } 
      //       var prevLand= this.$store.state.landList[index];
      //       this.$store.dispatch('setData',{state:'currentGroundID',data:prevLand.id});
      //       var centers=prevLand.centerPoint.split(",");

      //       var point=new BMap.Point(parseFloat( centers[0]),parseFloat(centers[1]));
      //       this.map.centerAndZoom(point);
      // }   
    },
    init_clo(callback) {
      var vthis = this;
      // console.log(2222)
      this.$http
        .get(
          "/auction/api/collect/getAllCollectLand/" +
            this.$store.state.userInfo.id,
          { timeOut: 5000 }
        )
        .then(function(res) {
          // console.log(res.data)
          if (res.data.code) {
            vthis.$store.dispatch('setData',{state:'sidebars',data:"02"})
            // vthis.sidebarActive="02";
            res.data.data = res.data.data.map(function(item) {
              var startTime = new Date(item.land.startTime);
              var now = new Date();
              if(vthis.$store.state.ctime){   //与服务器时间对比
                now=new Date(vthis.$store.state.ctime);
              }
              if (startTime < now && item.land.state == 0) {
                item.land.state = 1;
              }
              if (item.land.endTime) {
                var end = new Date(item.land.endTime);
                if (end < now) {
                  item.land.state = 2;
                }
              }
              return item;
            });
            vthis.$store.dispatch("setData", {
              state: "landList",
              data: res.data.data.map(function(item) {
                item.land.cityName = item.cityName;
                item.land.regionName = item.regionName;
                item.land.addr = item.addr;
                return item.land;
              })
            });
            // debugger;
            // console.log("li",vthis.$store.state.landList)
            // debugger;

            // debugger
            vthis.$store.dispatch("setData", {
              state: "currentGroundID",
              data: res.data.data[0].land.id
            });
            vthis.get_land_detail(res.data.data[0].land.id);

            // vthis.$store.state.landList = res.data.data
            // vthis.$store.state.currentGroundID = res.data.data[0].id  //设置当前地块ID

            if (vthis.$store.state.landList) {
              var map = vthis.map;
              map.clearOverlays();
              // //默认地块标注
              var markerP = vthis.$store.state.landList[0].centerPoint.split(
                ","
              );
              var cp = new BMap.Point(
                parseFloat(markerP[0]),
                parseFloat(markerP[1])
              );
              var marker = new BMap.Marker(cp); // 创建标注;
              map.addOverlay(marker);
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
              map.centerAndZoom(cp, 18);
              vthis.chageGroundStep(vthis.$store.state.landList[0].state);
              //添加覆盖物

              for (let i = 0; i < vthis.$store.state.landList.length; i++) {
                var ployArr = vthis.$store.state.landList[i].point.split("|"); //  ['1232,2323','1212,56666']
                var pointS = [];
                pointS = ployArr.map(function(item) {
                  // console.log(item);
                  item = item.split(",");
                  return new BMap.Point(
                    parseFloat(item[0]),
                    parseFloat(item[1])
                  );
                });
                // console.log(vthis.$store.state.landList[i].state)
                var polygon = new BMap.Polygon(
                  pointS,
                  vthis.ployStyle[vthis.$store.state.landList[i].state]
                );
                polygon.pid = vthis.$store.state.landList[i].id;
                polygon.state = vthis.$store.state.landList[i].state;
                map.addOverlay(polygon);
                //绑定覆盖物点击事件
                polygon.addEventListener("click", function(e) {
                  vthis.$store.dispatch("setData", {
                    state: "currentGroundID",
                    data: this.pid
                  });
                  vthis.get_land_detail(this.pid);
                  // console.log('currentID',vthis.$store.state.currentGroundID)
                  vthis.chageGroundStep(this.state);
                  // debugger;
                  if (
                    vthis.$store.state.groundStep == 1 &&
                    vthis.$refs["currentID"]
                  ) {
                    // console.log('ref',vthis.$refs)
                    // debugger;
                    vthis.$refs["currentID"].priceList = [];
                    vthis.$refs["currentID"].get_five_price(this.pid);
                  }
                  //创建小红点标注
                  if (marker) {
                    map.removeOverlay(marker);
                  }
                  // if(this.status == 1){
                  //   vthis.$store.state.currentGroundID = '0xWX4SDFSD1LKH';
                  // }else{
                  //   vthis.$store.state.currentGroundID = '0xWX4EYEFP1BHQ';
                  // }
                  // console.log(this.pid)
                  var land = vthis.$store.state.landList.filter(item => {
                    return item.id == this.pid;
                  });
                  var lan = land[0].centerPoint.split(",");
                  // console.log(lan)
                  marker = new BMap.Marker(
                    new BMap.Point(parseFloat(lan[0]), parseFloat(lan[1]))
                  ); // 创建标注
                  map.addOverlay(marker);
                  marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                });
              }

              // vthis.chageGroundStep();
            }
          } else {
            // console.log('没有收藏',res.data)
            // vthis.$store.state.sidebars = '01'
            //this.isActive="02";
            vthis.$message({
              showClose: true,
              message: "您暂时没有收藏记录哦!",
              type: "error"
            });
          }

          if (callback) callback();
        })
        .catch(function(err) {
          if (callback) callback();
          // console.log(err)
          vthis.$message({
            showClose: true,
            message: '抱歉,数据加载失败,刷新试试?',
            type: 'error'
          });
        });
      // console.log(vthis.$store.getters.currentGround)
    },
    init_my_land(callback) {
      var vthis = this;
      this.$http
        .get(
          "/auction/api/land/getUserAllLand/" + this.$store.state.userInfo.id,
          {timeOut:5000}
        )
        .then(function(res) {
          // console.log(res.data);
          if (res.data.code) {
            vthis.$store.dispatch('setData',{state:'sidebars',data:"03"})
            // vthis.sidebarActive="03";
            vthis.$store.dispatch("setData", {
              state: "landList",
              data: res.data.data.map(function(item) {
                item.land.cityName = item.cityName;
                item.land.regionName = item.regionName;
                item.land.addr = item.addr;
                return item.land;
              })
            });
            vthis.$store.dispatch("setData", {
              state: "currentGroundID",
              data: res.data.data[0].land.id
            });
            vthis.get_land_detail(res.data.data[0].land.id);
            if (vthis.$store.state.landList) {
              var map = vthis.map;
              map.clearOverlays();

              // //默认地块标注
              var markerP = vthis.$store.state.landList[0].centerPoint.split(
                ","
              );
              var cp = new BMap.Point(
                parseFloat(markerP[0]),
                parseFloat(markerP[1])
              );
              var marker = new BMap.Marker(cp); // 创建标注;
              map.addOverlay(marker);
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
              map.centerAndZoom(cp, 17);
              vthis.chageGroundStep(vthis.$store.state.landList[0].state);
              //添加覆盖物

              for (let i = 0; i < vthis.$store.state.landList.length; i++) {
                var ployArr = vthis.$store.state.landList[i].point.split("|"); //  ['1232,2323','1212,56666']
                var pointS = [];
                pointS = ployArr.map(function(item) {
                  // console.log(item);
                  item = item.split(",");
                  return new BMap.Point(
                    parseFloat(item[0]),
                    parseFloat(item[1])
                  );
                });
                // console.log(vthis.$store.state.landList[i].state)
                var polygon = new BMap.Polygon(
                  pointS,
                  vthis.ployStyle[vthis.$store.state.landList[i].state]
                );
                polygon.pid = vthis.$store.state.landList[i].id;
                polygon.state = vthis.$store.state.landList[i].state;
                map.addOverlay(polygon);
                //绑定覆盖物点击事件
                polygon.addEventListener("click", function(e) {
                  vthis.get_land_detail(this.pid);
                  // console.log('currentID',vthis.$store.state.currentGroundID)
                  vthis.chageGroundStep(this.state);
                  // debugger;
                  vthis.$store.dispatch("setData", {
                    state: "currentGroundID",
                    data: this.pid
                  });
                  if (
                    vthis.$store.state.groundStep == 1 &&
                    vthis.$refs["currentID"]
                  ) {
                    // console.log('ref',vthis.$refs)
                    // debugger;
                    vthis.$refs["currentID"].priceList = [];
                    vthis.$refs["currentID"].get_five_price(this.pid);
                  }
                  //创建小红点标注
                  if (marker) {
                    map.removeOverlay(marker);
                  }
                  // if(this.status == 1){
                  //   vthis.$store.state.currentGroundID = '0xWX4SDFSD1LKH';
                  // }else{
                  //   vthis.$store.state.currentGroundID = '0xWX4EYEFP1BHQ';
                  // }
                  // console.log(this.pid)
                  var land = vthis.$store.state.landList.filter(item => {
                    return item.id == this.pid;
                  });
                  var lan = land[0].centerPoint.split(",");
                  // console.log(lan)
                  marker = new BMap.Marker(
                    new BMap.Point(parseFloat(lan[0]), parseFloat(lan[1]))
                  ); // 创建标注
                  map.addOverlay(marker);
                  marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                });
              }
              // vthis.chageGroundStep();
            }
          } else {
            vthis.$message({
              showClose: true,
              message: "您暂时还没有地块!",
              type: "error"
            });
          }

          if (callback) callback();
        })
        .catch(function(err) {
          if (callback) callback();
          vthis.$message({
            showClose: true,
            message: err.message,
            type: "error"
          });
        });
    },
    init_record(callback) {
      var vthis = this;
      this.$http
        .get(
          "/auction/api/transaction/getInnerTransactionRecord/" +
            this.$store.state.userInfo.id,
          {timeOut:5000}
        )
        .then(function(res) {
          if (res.data.code == 1) {
            vthis.$store.dispatch('setData',{state:'sidebars',data:"04"})
            // console.log(res.data.data)
            //                     res.data.data=res.data.data.map(function(item){
            //   var startTime=new Date( item.startTime);
            //   var now=new Date();
            //   if((startTime<now)&&item.state==0){
            //      item.state =1;
            //   }
            //   if(item.endTime){
            //     var end=new Date(item.endTime);
            //     if(end<now){
            //       item.state =2;
            //     }
            //   }
            //   return item;
            // })
            vthis.$store.dispatch("setData", {
              state: "records",
              data: res.data.data
            });
            vthis.get_land_detail(res.data.data[0].land.id);
            vthis.$store.dispatch("setData", {
              state: "currentGroundID",
              data: res.data.data[0].land.id
            }); //设置当前地块ID
            // console.log(vthis.$store.state.records[0].land.id)
            if (vthis.$store.state.records[0].land.id) {
              // console.log('获取到了数据')
              var map = vthis.map;
              map.clearOverlays();

              //覆盖物样式
              var style1 = [
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
                  fillColor: "#ff966d",
                  strokeWeight: 1,
                  strokeOpacity: 0,
                  fillOpacity: 0.5
                }
              ];
              // //默认地块标注
              var markerP = vthis.$store.state.records[0].land.centerPoint.split(
                ","
              );
              var cp = new BMap.Point(
                parseFloat(markerP[0]),
                parseFloat(markerP[1])
              );
              var marker = new BMap.Marker(cp); // 创建标注;
              map.addOverlay(marker);
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
              map.centerAndZoom(cp, 17);
              vthis.chageGroundStep(vthis.$store.state.records[0].land.state);
              //添加覆盖物
              var recods = {};
              var ss = [];
              vthis.$store.state.records.forEach(function(item) {
                if (!recods[item.land.id]) {
                  ss.push(item);
                  recods[item.land.id] = true;
                }
              });
              for (let i = 0; i < ss.length; i++) {
                var item = ss[i];
                var ployArr = item.land.point.split("|"); //  ['1232,2323','1212,56666']
                var pointS = [];
                pointS = ployArr.map(function(item) {
                  // console.log(item);
                  item = item.split(",");
                  return new BMap.Point(
                    parseFloat(item[0]),
                    parseFloat(item[1])
                  );
                });
                // console.log(vthis.$store.state.records[i].state)
                var polygon = new BMap.Polygon(
                  pointS,
                  style1[item.transactionRecord.state]
                );
                polygon.pid = item.land.id;
                polygon.state = item.land.state;
                map.addOverlay(polygon);
                //绑定覆盖物点击事件
                polygon.addEventListener("click", function(e) {
                  vthis.get_land_detail(this.pid);
                  // console.log('currentID',vthis.$store.state.currentGroundID)
                  vthis.chageGroundStep(this.state);
                  // debugger;
                  vthis.$store.dispatch("setData", {
                    state: "currentGroundID",
                    data: this.pid
                  });
                  if (
                    vthis.$store.state.groundStep == 1 &&
                    vthis.$refs["currentID"]
                  ) {
                    // console.log('ref',vthis.$refs)
                    // debugger;
                    vthis.$refs["currentID"].priceList = [];
                    vthis.$refs["currentID"].get_five_price(this.pid);
                  }
                  //创建小红点标注
                  if (marker) {
                    map.removeOverlay(marker);
                  }
                  // if(this.status == 1){
                  //   vthis.$store.state.currentGroundID = '0xWX4SDFSD1LKH';
                  // }else{
                  //   vthis.$store.state.currentGroundID = '0xWX4EYEFP1BHQ';
                  // }
                  // console.log(this.pid)

                  var land = vthis.$store.state.records.filter(item => {
                    return item.land.id == this.pid;
                  });
                  if (land.length > 0) {
                    // console.log(land[0])
                    var lan = land[0].land.centerPoint.split(",");
                    // console.log(lan)
                    marker = new BMap.Marker(
                      new BMap.Point(parseFloat(lan[0]), parseFloat(lan[1]))
                    ); // 创建标注
                    map.addOverlay(marker);
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                  }
                });
              }
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
        .catch(function(err) {
          if (callback) callback();
          vthis.$message({
            showClose: true,
            message: '抱歉,数据加载失败,刷新试试?',
            type: 'error'
          });
        });
    },
    render_records() {},
    init_hot_land(callback) {
      debugger;
      var vthis = this;
      this.$http
        .get("/auction/api/land/getByMark/2" ,{timeOut:1000})
        .then(function(res) {
          if (res.data.code) {
            // debugger;
            //vthis.$store.dispatch('setData',{state:'sidebars',data:"05"})
            // vthis.sidebarActive="05";
            res.data.data = res.data.data.map(function(item) {
              var startTime = new Date(item.startTime);
              var now = new Date();
              if(vthis.$store.state.ctime){
                var localNow = (new Date).getTime()
                if(localNow>vthis.$store.state.ctimer){
                  var diff = localNow-vthis.$store.state.ctimer
                  now=new Date(vthis.$store.state.ctime+diff);
                }
              }
              if (startTime < now && item.state == 0) {
                item.state = 1;
              }

              if (item.endTime &&( item.state == 1||item.state == 0)) {
                var end = new Date(item.endTime);
                if (end < now) {
                  item.state = 2;
                }
              }
              return item;
            });
            
            vthis.$store.dispatch("setData", {
              state: "landList",
              data: res.data.data
            });
            vthis.landList = res.data.data
            vthis.get_land_detail(res.data.data[0].id);
            vthis.$store.dispatch("setData", {
              state: "currentGroundID",
              data: res.data.data[0].id
            });
            vthis.chageGroundStep(res.data.data[0].state);
            if (vthis.$store.state.landList) {
              var map = vthis.map;
              map.clearOverlays();
              map.setMinZoom(18)

              // //默认地块标注
              var markerP = vthis.$store.state.landList[0].centerPoint.split(
                ","
              );
              var cp = new BMap.Point(
                parseFloat(markerP[0]),
                parseFloat(markerP[1])
              );
              var marker = new BMap.Marker(cp); // 创建标注;
              map.addOverlay(marker);
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
              map.centerAndZoom(cp, 19);
              vthis.chageGroundStep(vthis.$store.state.landList[0].state);
              // if(vthis.$refs.getOwner){

              // }

              //添加覆盖物
              var PayloadList = [];
              var labelList=[];
              for (let i = 0; i < vthis.$store.state.landList.length; i++) {
                var item = vthis.$store.state.landList[i];
                var ployArr = item.point.split("|"); //  ['1232,2323','1212,56666']
                var pointS = [];
                pointS = ployArr.map(function(item) {
                  // console.log(item);
                  item = item.split(",");
                  return new BMap.Point(
                    parseFloat(item[0]),
                    parseFloat(item[1])
                  );
                });
                // console.log(vthis.$store.state.landList[i].state)
                var polygon = new BMap.Polygon(
                  pointS,
                  vthis.ployStyle[item.state]
                );
                polygon.pid = item.id;
                polygon.state = item.state;
                map.addOverlay(polygon);
                // debugger;
                
                if (vthis.landList[i].topPrice) {
                  var piontCen = vthis.landList[i].centerPoint.split(",");
                  var piontCenter = new BMap.Point(
                    parseFloat(piontCen[0]),
                    parseFloat(piontCen[1])
                  );
                  var opts = {
                    position: piontCenter, // 指定文本标注所在的地理位置
                    offset: new BMap.Size(-20, 0) //设置文本偏移量
                  };
                  var label = new BMap.Label(
                    vthis.landList[i].topPrice / 1000 + "k",
                    opts
                  ); // 创建文本标注对象
                  label.setStyle({
                    color: "#ffffff",
                    fontSize: "12px",
                    height: "20px",
                    lineHeight: "20px",
                    fontFamily: "微软雅黑"
                  });
                  label.pid = vthis.landList[i].id;
                  map.addOverlay(label);
                  labelList.push(label);
                }
                vthis.$store.dispatch("setLabel",labelList);



                //绑定覆盖物点击事件
                polygon.addEventListener("click", function(e) {
                  vthis.get_land_detail(this.pid);
                  // console.log('currentID',vthis.$store.state.currentGroundID)
                  vthis.chageGroundStep(this.state);
                  // debugger;
                  vthis.$store.dispatch("setData", {
                    state: "currentGroundID",
                    data: this.pid
                  });

                  if (
                    vthis.$store.state.groundStep == 1 &&
                    vthis.$refs["currentID"]
                  ) {
                    // console.log('ref',vthis.$refs)
                    // debugger;
                    vthis.$refs["currentID"].priceList = [];
                    vthis.$refs["currentID"].get_five_price(this.pid);
                  }

                  //创建小红点标注
                  if (marker) {
                    map.removeOverlay(marker);
                  }
                  // if(this.status == 1){
                  //   vthis.$store.state.currentGroundID = '0xWX4SDFSD1LKH';
                  // }else{
                  //   vthis.$store.state.currentGroundID = '0xWX4EYEFP1BHQ';
                  // }
                  // console.log(this.pid)
                  var land = vthis.$store.state.landList.filter(item => {
                    return item.id == this.pid;
                  });
                  var lan = land[0].centerPoint.split(",");
                  // console.log(lan)
                  marker = new BMap.Marker(
                    new BMap.Point(parseFloat(lan[0]), parseFloat(lan[1]))
                  ); // 创建标注
                  map.addOverlay(marker);
                  marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                });
                // console.log("AddPayLoad")
                PayloadList.push(polygon);
              }
              var detail = vthis.$store.state.landList.filter(function(item) {
                return item.id == vthis.$store.state.currentGroundID;
              });
              // console.log("findDetial",detail);
              if (detail) {
                // vthis.$store.dispatch('setData',{state:'currentGroundDetail',data:detail[0]});
              }

              // vthis.chageGroundStep();
              vthis.$store.dispatch("setPayLoad", PayloadList);
            }
          } else {
            vthis.$message({
              showClose: true,
              message: "您暂时还没有地块!"
            });
          }
          if (callback) callback();
        })
        .catch(function(err) {
          console.log('123456')
          if (callback) callback();
          vthis.$message({
            showClose: true,
            message: '抱歉,数据加载失败,刷新试试?',
            type: 'error'
          });
        });
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


