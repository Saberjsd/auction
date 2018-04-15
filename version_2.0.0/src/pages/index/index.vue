<template>
  <div class="wrap">
    <Headers>
    </Headers>
    <Sidebar>
    </Sidebar>
    <div id="allmap">

    </div> 
    <div class="nav">
      <div class="nav-left">
        <img src="~assets/icons/icon-area.png">
        <el-select v-model="cvalue" class="select-city">
          <el-option v-for="item in citys" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <img src="~assets/icons/icon-list-right.png">
        <el-select v-model="avalue" placeholder="请选择" class="select-area">
          <el-option v-for="item in area" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <img src="~assets/icons/icon-list-right.png">
        <el-input class="search-map" placeholder="请输入地块编号" v-model="search" clearable></el-input>
      </div>
      <template v-if="$store.state.sidebars != '04' && !$store.state.areaIn">
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
    <AreaIn v-show="$store.state.sidebars=='01' && $store.state.areaIn" @goGround="paint_land"></AreaIn>
    <GroundStep1 v-show="!$store.state.areaIn && $store.state.groundStep=='1' && $store.state.sidebars != '04'" @goArea="map_init"></GroundStep1>
    <GroundStep2 v-show="!$store.state.areaIn && $store.state.groundStep=='2' && $store.state.sidebars != '04'" @goArea="map_init"></GroundStep2>
    <GroundStep3 v-show="!$store.state.areaIn && $store.state.groundStep=='3' && $store.state.sidebars != '04'" @goArea="map_init"></GroundStep3>

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
import land from '@/store/land'
import landCenterPoint from '@/store/landCenterPoint'
import area from '@/store/area'

// console.log(ground)
export default {
  name: 'index',
  data () {
    return {
      map:null,
            
      citys: [{value: '1',label: '纽约'}, 
              {value: '2',label: '乌鲁木齐'},
              { value: '3',label: '北京'}],
      cvalue: '1',
      area: [ {value: '1',label: '布鲁克林'}, 
              {value: '2',label: '华尔街'}, 
              {value: '3',label: '曼哈顿'}],
      avalue: '1',
      search:'', //搜索框的
      priceList:[
        {uid:5,uname:'Tom',price:'22000',time:'2018/4/9 9:26:73'},
        {uid:4,uname:'Kaite',price:'21000',time:'2018/4/9 9:25:45'},
        {uid:3,uname:'Jack',price:'20000',time:'2018/4/9 9:23:05'},
        {uid:2,uname:'Anni',price:'25000',time:'2018/4/9 9:20:03'},
        {uid:1,uname:'Garen',price:'30000',time:'2018/4/9 9:20:00'}
      ]
    }
  },
  methods:{
    chageGroundStep:function(msg){
      // console.log(msg)
      this.$store.dispatch('setData',{state:'areaIn',data:false})
      this.$store.dispatch('setData',{state:'groundStep',data:msg})
    },
    goGround:function(data){
      this.paint_land()
    },
    map_init:function(){
      var vthis = this;
      var map = new BMap.Map('allmap', { enableMapClick: false });
      vthis.map = map;

      map.enableScrollWheelZoom(true);
      var point = new BMap.Point(-73.852634,40.877849)
      map.centerAndZoom(point, 14);
      //添加缩略图
	    var overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
		  map.addControl(overViewOpen);      //右下角，打开

      //覆盖物样式
      var style1 = [{strokeColor:"#f1f1f1",fillColor: "#9ac949", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                   {strokeColor:"#f1f1f1",fillColor: "#1253fc", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,}]

      var areaArr = area.split('|')
      // for(var i=0; i<area.length; i++){
         var pointS = areaArr.map(function(item){
            // console.log(item);
            item=item.split(",");
            return new BMap.Point(parseFloat(item[0]) , parseFloat(item[1]));
        });

      var area1 = new BMap.Polygon(pointS,style1[0])
      map.addOverlay(area1)
      // }
      


    },
    paint_land:function(){
      var vthis = this;
      var map = vthis.map;
      console.log(map)
      map.clearOverlays()

      var point = new BMap.Point(-73.852634,40.877849)
      map.centerAndZoom(point, 17);
      //覆盖物样式
      var style1 = [{strokeColor:"#f1f1f1",fillColor: "#9ac949", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                   {strokeColor:"#f1f1f1",fillColor: "#1253fc", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,},
                    {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,}]
      //默认地块标注
      var markerP = landCenterPoint[0].split(',')
      var marker = new BMap.Marker(new BMap.Point(parseFloat(markerP[0]), parseFloat(markerP[1]) ));// 创建标注;
      map.addOverlay(marker);
      //添加覆盖物
      for(let i=0; i<land.length; i++){
          var ployArr = land[i].split('|')//  ['1232,2323','1212,56666']
          var pointS = [];
          // for(var j=0; j<ployArr.length; j++){
          //   var pl = ployArr[j].split(',')  //[123,515,32102,]
          //   for(var m=0; m<pl.length; m=m+2){
          //     polygons.push(new BMap.Point(parseFloat(pl[m]) , parseFloat(pl[m+1]) ))
          //   }
            
          // }
          pointS= ployArr.map(function(item){
            // console.log(item);
            item=item.split(",");
            return new BMap.Point(parseFloat( item[0]),parseFloat(item[1]));
          });
          // console.log(pointS)

          var polygon = new BMap.Polygon(pointS,style1[i%3])
          polygon.status=i%3+1;

          map.addOverlay(polygon);
          //绑定覆盖物点击事件
          polygon.addEventListener('click',function(e){
            vthis.chageGroundStep(this.status);
            //创建小红点标注
            if(marker){
              map.removeOverlay(marker)
            }
            if(this.status == 1){
              vthis.$store.state.currentGroundID = '0xWX4SDFSD1LKH';
            }else{
              vthis.$store.state.currentGroundID = '0xWX4EYEFP1BHQ';
            }
            
            var lan = landCenterPoint[i].split(',')
            marker = new BMap.Marker(new BMap.Point(parseFloat(lan[0]), parseFloat(lan[1]) ));// 创建标注
            map.addOverlay(marker);
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
              })
      }
    }
  },
  mounted(){
    this.map_init()
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


