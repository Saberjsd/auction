<template>
    <div class="container">
        <Headers>

        </Headers>
        
        <button @click="fun">点击改变msg</button>
        <br>
        msg:{{msg}}
    </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a{text-decoration: none;}
ul,li{list-style: none;}
.container{position: relative;}

</style>

<script>
import Headers from '@/components/header'
import {mapActions,mapGetters} from 'vuex';

export default {
  name: 'auction_market',
  data () {
    return {
        name:'marke'
    }  
  },
  components:{
      Headers
  },
  computed:{
      ...mapGetters(['msg'])
  },
  methods:{
      ...mapActions(['fun'])
  }
}
</script>


