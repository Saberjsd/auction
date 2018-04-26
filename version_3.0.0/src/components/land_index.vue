<template>
  <div>
        <!-- 未开拍的 -->
        <div v-if="Land.state==0">
          <Land1 :Land="Land"></land1>
        </div>
            <!-- 开拍的 -->
        <div v-else-if="Land.state==1">
            <Land2 :Land="Land"></land2>
        </div>
        <!-- 拍 完  待支付-->
        <div v-else-if="Land.state==2">
            
        </div>
         <!-- 拍 完  已支付-->
        <div v-else>
            
        </div>

      <div>
</template>
<script>
    import Land1 from "./Land1.vue"
    import Land2 from "./Land2.vue"
    export default{
        props:["Land"],
        components:{
            Land1,
            Land2
        },
        data(){
            return {
                
            }
        }
    }
</script>
