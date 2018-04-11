<template>
    <div class="container">
        <Headers>

        </Headers>
        
        <button @click="fun">marke1</button>
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
import {mapGetters} from 'vuex';

export default {
  name: 'market1',
  data () {
    return {
        name:'marke1'
    }  
  },
  components:{
      Headers
  },
  computed:{
      ...mapGetters(['msg'])
  }
  
}
</script>


