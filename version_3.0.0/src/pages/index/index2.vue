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
    <div>
        <router-view>
        
        </router-view> 
    </div>




  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
