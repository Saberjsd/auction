<template>
  <div class="wrap">
    <Headers>
    </Headers>
    <Sidebar>
    </Sidebar> 
    <div class="nav">
      
    </div>
  </div>
</template>

<script>
import Headers from '@/components/header'
import Sidebar from '@/components/sidebar'
export default {
  name: 'index',
  data () {
    return {

    }
  },
  components:{
      Headers,
      Sidebar
  }
}
</script>

<style scoped>
.wrap{
  width: 100%;height: 100%;
}
.nav{height: 60px;}
</style> 


