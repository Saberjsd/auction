<template>
  <div class="wrap">
    <Headers>
    </Headers>
    <Sidebar @chageSidebar="chageSidebar">
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
      <template v-if="siderbars != '04'">
        <div class="nav-right">
          <li class="step1"></li>
          <li class="step-text">未开拍</li>
          <li class="step2"></li>
          <li class="step-text">拍卖中</li>
          <li class="step3"></li>
          <li class="step-text">已拍完</li>
        </div>
      </template>
      <template v-if="siderbars == '04'">
        <div class="nav-right">
          <li class="step1"></li>
          <li class="step-text">待支付</li>
          <li class="step2"></li>
          <li class="step-text">已支付</li>
        </div>
      </template>
    </div>

    <AreaIn v-show="siderbars=='01' && areaIn" :areaIn="areaIn" @chageGroundStep="chageGroundStep"></AreaIn>
    <GroundStep1 v-show="groundIn && groundStep=='1'" @goArea="goArea" :groundIn="groundIn"></GroundStep1>
    <GroundStep2 v-show="groundIn && groundStep=='2'" @goArea="goArea" :groundIn="groundIn"></GroundStep2>
    <GroundStep3 v-show="groundIn && groundStep=='3'" @goArea="goArea" :groundIn="groundIn"></GroundStep3>

    <Record v-if="siderbars =='04'" :records="records"></Record>
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

export default {
  name: 'index',
  data () {
    return {
      groundStep:'1',  //未开拍"1",拍卖中"2",已拍卖"3"
      areaIn:true, //是否显示区域
      //{"auction":"01","collection":"02","myGround":"03","record":"04"}
      siderbars:'01',
      records:[{gid:'0xmlsdfl1231',status:0}],
      collections:[{id:'0x123156131FDSV1531'}],
            
      citys: [{value: '1',label: '纽约'}, 
              {value: '2',label: '乌鲁木齐'},
              { value: '3',label: '北京'}],
      cvalue: '1',
      area: [ {value: '1',label: '布鲁克林'}, 
              {value: '2',label: '华尔街'}, 
              {value: '3',label: '曼哈顿'}],
      avalue: '1',
      search:'',
      priceList:[
        {uid:5,uname:'Tom',price:'22000',time:'2018/4/9 9:26:73'},
        {uid:4,uname:'Kaite',price:'21000',time:'2018/4/9 9:25:45'},
        {uid:3,uname:'Jack',price:'20000',time:'2018/4/9 9:23:05'},
        {uid:2,uname:'Anni',price:'25000',time:'2018/4/9 9:20:03'},
        {uid:1,uname:'Garen',price:'30000',time:'2018/4/9 9:20:00'}
      ]
    }
  },
  computed:{
    groundIn:function(){
      if(this.siderbars == "01"){
        return !this.areaIn
      }
      if(this.siderbars == "02"||this.siderbars == "03"){
        return true;
      }
    }
  },
  methods:{
    
    chageGroundStep:function(msg){
      // console.log(msg)
      this.areaIn = false;
      this.groundStep = msg
    },
    goArea:function(msg){
      this.areaIn = true;
    },
    chageSidebar:function(msg){
      this.siderbars = msg
    },
    map_init:function(){
      var vthis = this;
      var map = new BMap.Map('allmap', { enableMapClick: false });
      // map.enableScrollWheelZoom(true);
      var point = new BMap.Point(116.322773,40.055879)
      map.centerAndZoom(point, 17);
      
      //增加覆盖物
      var polygon1 = new BMap.Polygon([
        new BMap.Point( 116.321884 , 40.059958),
        new BMap.Point( 116.318506 , 40.058743),
        new BMap.Point( 116.320446 , 40.055899),
        new BMap.Point( 116.323896 , 40.057583)
      ], {strokeColor:"#f1f1f1",fillColor: "#9ac949", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,});

      var polygon2 = new BMap.Polygon([
        new BMap.Point(116.320554 , 40.055844),
        new BMap.Point(116.321704 , 40.054353),
        new BMap.Point(116.325082 , 40.055733),
        new BMap.Point(116.324004 , 40.057307)
      ], {strokeColor:"#f1f1f1",fillColor: "#1253fc", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,});
      
      var polygon3 = new BMap.Polygon([
        new BMap.Point(116.321955 , 40.054076),
        new BMap.Point(116.323644 , 40.052061),
        new BMap.Point(116.327202 , 40.054435),
        new BMap.Point(116.325441 , 40.055319)
      ], {strokeColor:"#f1f1f1",fillColor: "#ff966d", strokeWeight:1, strokeOpacity:0,fillOpacity: 0.5,});
    
      map.addOverlay(polygon1);
      map.addOverlay(polygon2); 
      map.addOverlay(polygon3);
      // console.log(polygon1)
      var marker = marker = new BMap.Marker(new BMap.Point(116.321075, 40.058054));// 创建标注
      map.addOverlay(marker);
      marker.setAnimation(BMAP_ANIMATION_BOUNCE);
      // map.setViewport(polygon2.getPath()); //设置中心视图
      polygon1.addEventListener('click',function(e){
        vthis.chageGroundStep('1');
        // 创建小红点标注
        if(marker){
           map.removeOverlay(marker)
        }
        vthis.records[0].status = 0;
        marker = new BMap.Marker(new BMap.Point(116.321075, 40.058054));// 创建标注
        map.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      })

      polygon2.addEventListener('click',function(e){
        vthis.chageGroundStep('2')
        // 创建小红点标注
        if(marker){
           map.removeOverlay(marker)
        }
        vthis.records[0].status = 1;
        // console.log(vthis.)
        marker = new BMap.Marker(new BMap.Point(116.322746, 40.055776));// 创建标注
        map.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      })

      polygon3.addEventListener('click',function(e){
        vthis.chageGroundStep('3');
        // 创建小红点标注
        if(marker){
           map.removeOverlay(marker)
        }
        marker = new BMap.Marker(new BMap.Point(116.324453, 40.053925));// 创建标注
        map.addOverlay(marker);
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      })

    },
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


