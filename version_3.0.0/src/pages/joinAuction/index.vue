<template>
  <div class="JoinAuction">
    <header></header>

    <router-view><router-view>

  </div>



</template>

<script>
import LandState from "@/componentS/land_index"
export default {
  components:{
    LandState
  },
  data() {
    return {
        citys:[],
        
    };
  },
  methods: {
    getCitys() {
      if (!this.$store.state.citys) {
        this.$http
          .get("/auction/api/city/getAll", { timeOut: 5000 })
          .then(res=> {
            if (res.data.code) {
              this.citys = res.data.data;
              this.$store.dispatch("setData", {
                state: "currentCityID",
                data: res.data.data[0].id
              });
            }
            if (call) call();
          })
          .catch(function(err) {});
      }
    },
    getArea() {
      if (this.$store.state.areas) {
      }
    }
  }
};
</script>

<style>

</style>

