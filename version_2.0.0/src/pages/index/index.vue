<template>
  <div class="wrap">
    <Headers>
    </Headers>
    <Sidebar @chageSidebar="chage_sidebar">
    </Sidebar>
    <div id="allmap">

    </div> 
    <div class="nav">
      <div class="nav-left">
        <img src="~assets/icons/icon-area.png">
        <el-select v-model="cvalue" class="select-city" @change="get_map_area_list(cvalue)">
          <el-option v-for="(item) in citys" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>

        <template v-if="$store.state.sidebars != '05' ">
          <img src="~assets/icons/icon-list-right.png">
          <el-select v-model="avalue" placeholder="请选择" class="select-area" @change="get_map_area_detail(avalue)" >
            <el-option v-for="(item) in areaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>

          <img src="~assets/icons/icon-list-right.png">
          <el-input class="search-map" placeholder="请输入地块编号" v-model="search" clearable></el-input>
        </template>

        <template v-if="$store.state.sidebars == '05'">
          <img src="~assets/icons/icon-siderbar-e-hover.png" alt="热门地块">
          <div class="hot-land">中央公园</div>
        </template>
        
      </div>
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
          <li class="step1"></li>
          <li class="step-text">待支付</li>
          <li class="step2"></li>
          <li class="step-text">已支付</li>
        </div>
      </template>
    </div>
    <AreaIn v-show="$store.state.sidebars=='01' && $store.getters.areaIn" @goGround="get_map_land_list(avalue)"></AreaIn>
    <GroundStep1 v-show="!$store.getters.areaIn && $store.state.groundStep==0 && $store.state.sidebars != '04'" @goArea="render_area" :state="$store.state.groundStep"></GroundStep1>
    <GroundStep2 ref="currentID" v-show="!$store.getters.areaIn && $store.state.groundStep==1 && $store.state.sidebars != '04'" @goArea="render_area" :state="$store.state.groundStep" :lanId="$store.state.currentGroundID"></GroundStep2>
    <GroundStep3 v-show="!$store.getters.areaIn && ($store.state.groundStep==3||$store.state.groundStep==2) && $store.state.sidebars != '04'" @goArea="render_area" :state="$store.state.groundStep"></GroundStep3>

    <Record v-if="$store.state.sidebars =='04'"></Record>
  </div>
</template>

<script>
import Headers from '@/components/header'
import Sidebar from '@/components/sidebar'
import AreaIn from '@/components/AreaIn'
import GroundStep1 from '@/components/GroundStep1'
import GroundStep2 from '@/components/GroundStep2'
import GroundStep3 from '@/components/GroundStep3'
import Record from '@/components/Record'

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
  name: 'index',
  data () {
    return {
      map:null,
      cityAndArea:[],      
      citys: [],
      cvalue: 1,
      avalue: 1,

      areaList: [],
      areaDetail:null,
      landList:[],

      land:[],
      search:'', //搜索框的
      priceList:[],
      ployStyle:[   {strokeColor:"#f1f1f1",fillColor: "#9ac949", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    {strokeColor:"#f1f1f1",fillColor: "#1253fc", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,}
                ],

    }
  },
  computed:{
    // ste(){
    //   console.log("Step",this.$store.state.groundStep);
    //   return this.$store.state.groundStep;
    // }
    
  },
  // watch:{
  //   avalue(value){
  //     console.log(value)
  //   }
  // },
  methods:{
    init(){
      // this.get_all_city_area()

      this.get_citys()
      this.get_map_area_list()
      this.get_map_area_detail()
    },
    chage_sidebar(){
      var sidebars = this.$store.state.sidebars
      if(sidebars == '01'){
        this.get_citys()
        this.get_map_area_list()
        this.get_map_area_detail()
      }else if(sidebars == '02'){
        this.init_clo()
      }else if(sidebars == '03'){
        this.init_my_land()
      }else if(sidebars == '04'){
        this.init_record()
      }else{
        this.init_hot_land()
      }
    },
    get_citys(){
      var vthis = this;
      this.$http.get('/api/city/getAll')
                .then(function (res) {
                  // console.log(res);
                  if(res.data.code){
                    vthis.citys = res.data.data;
                    vthis.$store.state.currentCityID = res.data.data[0].id
                  }
                })
                .catch(function (err) {
                  console.log(err);
                });
    },
    get_map_area_list(cid=this.$store.state.currentCityID){
      var vthis = this;
      this.$http.get('/api/region/getByCityId/'+cid)
                .then(function (res) {
                  // console.log(res);
                  if(res.data.code){
                    vthis.areaList = res.data.data;
                    vthis.$store.state.areaList = res.data.data;

                    vthis.avalue = res.data.data[0].id 
                    // console.log(vthis.areaList) 
                    vthis.$store.dispatch('setData',{state:'currentAreaID',data:vthis.avalue})
                  }
                })
                .catch(function (err) {
                  console.log(err);
                });
    },
    get_map_area_detail(aid=this.$store.state.currentAreaID){
      var vthis = this;
      this.$http.get('/api/region/getDetail/'+aid)
                .then(function (res) {
                  // console.log(res);
                  vthis.areaDetail = res.data.data;
                  // console.log(vthis.land)
                  vthis.$store.dispatch('setData',{state:'areaDatail',data:res.data.data})
                  vthis.render_area()
                })
                .catch(function (err) {
                  console.log(err);
                });
    },
    get_map_land_list(aid=this.$store.state.currentAreaID){
      // debugger;
      // console.log(aid)
      var vthis = this;
      this.$http.get('/api/land/getByRegionId/'+aid)
                .then(function (res) {
                  // debugger;
                  vthis.landList = res.data.data;
                  // console.log('landList',vthis.landList)
                  vthis.$store.dispatch('setData',{state:'landList',data:res.data.data})
                  vthis.paint_land()
                })
                .catch(function (err) {
                  console.log(err);
                });
    },
    chageGroundStep:function(msg){
      // console.log('msg',msg)
      this.$store.dispatch('setData',{state:'groundIn',data:true})
      this.$store.dispatch('setData',{state:'groundStep',data:msg})
    },
    goGround:function(data){
      this.get_map_land_list()
      // this.paint_land()
    },
    map_init:function(){
      var vthis = this;
      var map = new BMap.Map('allmap', { enableMapClick: false });
      vthis.map = map;

      map.enableScrollWheelZoom(true);
      // var point = new BMap.Point(-73.852634,40.877849)
      var point = new BMap.Point(-73.912785,40.827263) //纽约中心点
      map.centerAndZoom(point, 13);
      //添加缩略图
	    var overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
		  map.addControl(overViewOpen);      //右下角，打开

      //覆盖物样式
      var style1 = [{strokeColor:"#f1f1f1",fillColor: "#9ac949", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                   {strokeColor:"#f1f1f1",fillColor: "#1253fc", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,}]
      
      // }
      // map.addEventListener('click',function(e){
      //   console.log(e.point)
      // })
    },
    render_area(){
      if(this.areaDetail){
        // console.log(111)
        this.$store.state.groundIn =false;
        this.map.clearOverlays()
        //覆盖物样式
        var style1 = [{strokeColor:"#f1f1f1",fillColor: "#9ac949", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                   {strokeColor:"#f1f1f1",fillColor: "#1253fc", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,}]
        var areaArr = this.areaDetail.region.point.split('|')
        // for(var i=0; i<area.length; i++){
        var pointS = areaArr.map(function(item){
            // console.log(item);
            item=item.split(",");
            return new BMap.Point(parseFloat(item[0]) , parseFloat(item[1]));
        });

        var area1 = new BMap.Polygon(pointS,style1[0])
        this.map.addOverlay(area1)

        var areaC = this.areaDetail.region.centerPoint.split(',')
        var areaCP = new BMap.Point(parseFloat(areaC[0]) , parseFloat(areaC[1]))
        var marker = new BMap.Marker(areaCP)
        this.map.addOverlay(marker)
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        this.map.centerAndZoom(areaCP,13)
      }
    },
    paint_land:function(){
      var vthis = this;
      // debugger;
      if(vthis.landList){
        // console.log(vthis.landList)
        var map = vthis.map;
        // console.log(map)
        map.clearOverlays()
        
        //覆盖物样式
        var style1 = [{strokeColor:"#f1f1f1",fillColor: "#9ac949", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    {strokeColor:"#f1f1f1",fillColor: "#1253fc", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                      {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,}]
        // //默认地块标注
        var markerP = vthis.landList[0].centerPoint.split(',')
        var cp = new BMap.Point(parseFloat(markerP[0]), parseFloat(markerP[1]) )
        var marker = new BMap.Marker(cp);// 创建标注;
        map.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

        map.centerAndZoom(cp, 17);
        vthis.chageGroundStep(vthis.landList[0].state)
        //添加覆盖物

        for(let i=0; i<vthis.landList.length; i++){
            var ployArr = vthis.landList[i].point.split('|')//  ['1232,2323','1212,56666']
            var pointS = [];
            pointS= ployArr.map(function(item){
              // console.log(item);
              item=item.split(",");
              return new BMap.Point(parseFloat( item[0]),parseFloat(item[1]));
            });
            // console.log(vthis.landList[i].state)
            var polygon = new BMap.Polygon(pointS,style1[vthis.landList[i].state])
            polygon.pid = vthis.landList[i].id;
            polygon.state = vthis.landList[i].state;
            map.addOverlay(polygon);
            if(vthis.landList[i].state == 1){
              var piontCen = vthis.landList[i].centerPoint.split(',');
              var piontCenter = new BMap.Point(parseFloat(piontCen[0]), parseFloat(piontCen[1]) )
              var opts = {
                position : piontCenter,    // 指定文本标注所在的地理位置
                offset   : new BMap.Size(-20, 0)    //设置文本偏移量
              }
              var label = new BMap.Label(vthis.landList[i].topPrice/10000+'万', opts);  // 创建文本标注对象
              label.setStyle({
                  color : "red",
                  fontSize : "12px",
                  height : "20px",
                  lineHeight : "20px",
                  fontFamily:"微软雅黑"
              });
              map.addOverlay(label);
            }
             


            //绑定覆盖物点击事件
            polygon.addEventListener('click',function(e){

              // console.log('currentID',vthis.$store.state.currentGroundID)
              vthis.chageGroundStep(this.state);
              // debugger;
              vthis.$store.dispatch('setData',{state:'currentGroundID',data:this.pid})
              if(vthis.$store.state.groundStep ==1&&vthis.$refs['currentID']){
                // console.log('ref',vthis.$refs)
                // debugger;
                vthis.$refs['currentID'].priceList = []
                vthis.$refs['currentID'].get_five_price(this.pid);
              }
              //创建小红点标注
              if(marker){
                map.removeOverlay(marker)
              }
              // if(this.status == 1){
              //   vthis.$store.state.currentGroundID = '0xWX4SDFSD1LKH';
              // }else{
              //   vthis.$store.state.currentGroundID = '0xWX4EYEFP1BHQ';
              // }
              // console.log(this.pid)
              var land = vthis.landList.filter((item)=>{
                return item.id == this.pid
              })
              var lan = land[0].centerPoint.split(',')
              // console.log(lan)
              marker = new BMap.Marker(new BMap.Point(parseFloat(lan[0]), parseFloat(lan[1]) ));// 创建标注
              map.addOverlay(marker);
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
              // var label = new BMap.Label(vthis.landList[i].topPrice/10000+'万',{offset:new BMap.Size(20,-10)});
              // marker.setLabel(label);
              
              })
          }
          // vthis.chageGroundStep();

      }
      
    },

    render_map:function(landList){
      var vthis = this;
      // debugger;
      if(landList){
        var map = this.map;
        map.clearOverlays()
        //覆盖物样式
        var style1 = this.ployStyle;
        //默认地块标注
        var markerP = landList[0].centerPoint.split(',')
        var cp = new BMap.Point(parseFloat(markerP[0]), parseFloat(markerP[1]) )
        var marker = new BMap.Marker(cp);// 创建标注;
        map.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        map.centerAndZoom(cp, 17);
        this.chageGroundStep(landList[0].state)
        //添加覆盖物

        for(let i=0; i<landList.length; i++){
            var ployArr = landList[i].point.split('|')//  ['1232,2323','1212,56666']
            var pointS = [];
            pointS= ployArr.map(function(item){
              // console.log(item);
              item=item.split(",");
              return new BMap.Point(parseFloat( item[0]),parseFloat(item[1]));
            });
            // console.log(landList[i].state)
            var polygon = new BMap.Polygon(pointS,style1[landList[i].state])
            polygon.pid = landList[i].id;
            polygon.state = landList[i].state;
            map.addOverlay(polygon);
            //绑定覆盖物点击事件
            polygon.addEventListener('click',function(e){

              // console.log('currentID',vthis.$store.state.currentGroundID)
              vthis.chageGroundStep(this.state);
              // debugger;
              vthis.$store.dispatch('setData',{state:'currentGroundID',data:this.pid})
              if(vthis.$store.state.groundStep ==1&&vthis.$refs['currentID']){
                // console.log('ref',vthis.$refs)
                // debugger;
                vthis.$refs['currentID'].priceList = []
                vthis.$refs['currentID'].get_five_price(this.pid);
              }
              //创建小红点标注
              if(marker){
                map.removeOverlay(marker)
              }
              // if(this.status == 1){
              //   vthis.$store.state.currentGroundID = '0xWX4SDFSD1LKH';
              // }else{
              //   vthis.$store.state.currentGroundID = '0xWX4EYEFP1BHQ';
              // }
              // console.log(this.pid)
              var land = landList.filter((item)=>{
                return item.id == this.pid
              })
              var lan = land[0].centerPoint.split(',')
              // console.log(lan)
              marker = new BMap.Marker(new BMap.Point(parseFloat(lan[0]), parseFloat(lan[1]) ));// 创建标注
              map.addOverlay(marker);
              marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
              })
          }
          // vthis.chageGroundStep();

      }
      
    },

    init_clo(){
      var vthis = this;
      this.$http.get('/api/collect/getAllCollectLand/'+5,{timeOut:10000})
                .then(function (res) {
                  if(res.data.code){
                    vthis.$store.state.landList = res.data.data
                    vthis.$store.state.currentGroundID = res.data.data[0].id  //设置当前地块ID

                    // console.log("collections",vthis.$store.state.records)
                    // console.log('currentGroundID',vthis.$store.state.currentGroundID)
                    // console.log('currentGround',vthis.$store.getters.currentGround)
                    //  debugger; 
                    if(vthis.$store.state.landList){
                    var map = vthis.map;
                    map.clearOverlays()
                    
                    //覆盖物样式
                    var style1 = [{strokeColor:"#f1f1f1",fillColor: "#9ac949", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                                {strokeColor:"#f1f1f1",fillColor: "#1253fc", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                                {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                                  {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,}]
                    // //默认地块标注
                    var markerP = vthis.$store.state.landList[0].centerPoint.split(',')
                    var cp = new BMap.Point(parseFloat(markerP[0]), parseFloat(markerP[1]) )
                    var marker = new BMap.Marker(cp);// 创建标注;
                    map.addOverlay(marker);
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    map.centerAndZoom(cp, 17);
                    vthis.chageGroundStep(vthis.$store.state.landList[0].state)
                    //添加覆盖物

                    for(let i=0; i<vthis.$store.state.landList.length; i++){
                        var ployArr = vthis.$store.state.landList[i].point.split('|')//  ['1232,2323','1212,56666']
                        var pointS = [];
                        pointS= ployArr.map(function(item){
                          // console.log(item);
                          item=item.split(",");
                          return new BMap.Point(parseFloat( item[0]),parseFloat(item[1]));
                        });
                        // console.log(vthis.$store.state.landList[i].state)
                        var polygon = new BMap.Polygon(pointS,style1[vthis.$store.state.landList[i].state])
                        polygon.pid = vthis.$store.state.landList[i].id;
                        polygon.state = vthis.$store.state.landList[i].state;
                        map.addOverlay(polygon);
                        //绑定覆盖物点击事件
                        polygon.addEventListener('click',function(e){

                          // console.log('currentID',vthis.$store.state.currentGroundID)
                          vthis.chageGroundStep(this.state);
                          // debugger;
                          vthis.$store.dispatch('setData',{state:'currentGroundID',data:this.pid})
                          if(vthis.$store.state.groundStep ==1&&vthis.$refs['currentID']){
                            // console.log('ref',vthis.$refs)
                            // debugger;
                            vthis.$refs['currentID'].priceList = []
                            vthis.$refs['currentID'].get_five_price(this.pid);
                          }
                          //创建小红点标注
                          if(marker){
                            map.removeOverlay(marker)
                          }
                          // if(this.status == 1){
                          //   vthis.$store.state.currentGroundID = '0xWX4SDFSD1LKH';
                          // }else{
                          //   vthis.$store.state.currentGroundID = '0xWX4EYEFP1BHQ';
                          // }
                          // console.log(this.pid)
                          var land = vthis.$store.state.landList.filter((item)=>{
                            return item.id == this.pid
                          })
                          var lan = land[0].centerPoint.split(',')
                          // console.log(lan)
                          marker = new BMap.Marker(new BMap.Point(parseFloat(lan[0]), parseFloat(lan[1]) ));// 创建标注
                          map.addOverlay(marker);
                          marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                          })
                      }
                      // vthis.chageGroundStep();

                  }
                    

                    // if(vthis.$store.getters.currentGround){
                    //   var map = vthis.map;
                    //   map.clearOverlays()
                    //   //覆盖物样式
                    //   var style1 = [{strokeColor:"#f1f1f1",fillColor: "#9ac949", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    //               {strokeColor:"#f1f1f1",fillColor: "#1253fc", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    //               {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    //                 {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,}]
                    //   // //默认地块标注
                    //   var markerP = vthis.$store.getters.currentGround.centerPoint.split(',')
                    //   var cp = new BMap.Point(parseFloat(markerP[0]), parseFloat(markerP[1]) )
                    //   var marker = new BMap.Marker(cp);// 创建标注;
                    //   map.addOverlay(marker);
                    //   marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    //   map.centerAndZoom(cp, 17);

                    //   vthis.chageGroundStep(vthis.$store.getters.currentGround.state)

                    //   //添加覆盖物
                    //   var ployArr = vthis.$store.getters.currentGround.point.split('|')//  ['1232,2323','1212,56666']
                    //   var pointS = [];
                    //   pointS= ployArr.map(function(item){
                    //     // console.log(item);
                    //     item=item.split(",");
                    //     return new BMap.Point(parseFloat( item[0]),parseFloat(item[1]));
                    //   });
                    //   var polygon = new BMap.Polygon(pointS,style1[vthis.$store.getters.currentGround.state])
                    //   // polygon.pid = vthis.$store.getters.currentGround[0].id;
                    //   // polygon.state = vthis.$store.getters.currentGround[0].state;
                    //   map.addOverlay(polygon);
                    // }

                  }
                })
                .catch(function (err) {
                  
                });
      // console.log(vthis.$store.getters.currentGround)
      
    },
    init_my_land(){

    },
    init_record(){

    },
    init_hot_land(){

    }

  },
  // updated(){
  //   console.log('store',this.$store.state);
  // },
  mounted(){
    this.init()
    this.map_init();
    // this.render_map()
    // console.log(this.$store.state.groundStep)
  },
  components:{
      Headers,
      Sidebar,
      AreaIn,
      GroundStep1,
      GroundStep2,
      GroundStep3,
      Record
  }
}
</script>

<style scoped>

</style> 


