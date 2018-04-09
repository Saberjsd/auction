<template>
    <div class="container">
        <Headers>

        </Headers>
        <div id="allmap">
         
        </div> 
        <div class="infoWindow" v-show="inforWindowShow">
          <span class="infoClose" @click="infoClose">x</span>
          <h3>热门地皮</h3>
          <p>当前点的经度：{{point.lng}},纬度：{{point.lat}}</p>
        </div>
    </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a{text-decoration: none;}
.container{position: relative;}
#allmap{
  width: 100%;height: 400px;
}
.infoWindow{
  position: absolute;left: 30px;top: 140px;background:rgba(255,255,255,0.8);
  width: 200px;height: 300px;
  font-size: 12px;
}
.infoClose{
  width: 30px;height: 30px;border-radius: 50%;box-shadow: 1px 2px 2px #666;
  cursor: pointer;font-size: 20px;text-align: center;line-height: 30px;display: inline-block;
  position: absolute;right: -5px;top: -5px;background: white;color: red;
}

</style>

<script>
import Headers from '@/components/header'
export default {
  name: 'detail',
  data () {
    return {
      inforWindowShow:false,
      point:{
        lng:0,
        lat:0
      }    
    }
  },
  components:{
      Headers
  },
  methods:{
    map_init:function(){
      var vthis = this;
      var map = new BMap.Map('allmap');
      map.enableScrollWheelZoom(true);
      var point = new BMap.Point(-73.857482,40.888277)
      map.centerAndZoom(point, 17);
      // 创建小红点标注
      var marker = new BMap.Marker(new BMap.Point(-73.858506,40.888323));// 创建标注
      map.addOverlay(marker);
      //监听小红点的事件
      marker.addEventListener("click",function(){
        var mp = marker.getPosition();
        vthis.point.lng = mp.lng;
        vthis.point.lat = mp.lat;
        vthis.inforWindowShow = true;
        // console.log(vthis)
        // console.log(this.point);
      })
      //增加覆盖物
      var polygon = new BMap.Polygon([
        new BMap.Point(-73.85962,40.88915),
        new BMap.Point(-73.856844,40.888277),
        new BMap.Point(-73.857203,40.887623),
        new BMap.Point(-73.85997,40.888509)
      ], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
      map.addOverlay(polygon); 

    },

    infoClose:function(){
      this.inforWindowShow=false;
    }
  },
  mounted(){
    this.map_init()
  }
}
</script>


