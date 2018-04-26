<template>
    <div class="infoWindow">
        <div class="info-head">
            <i @click="goArea" v-if="$store.state.sidebars =='01'"></i>
            <span @click="$store.dispatch('setGroundShowDetail')">
                地块信息
                <em :class="{active:!$store.state.groundShowDetail}"></em>
            </span>
            <b :class="{collection:true,active:$store.state.landIsCollected}" @click="collectionClick"></b>
        </div>
        <el-collapse-transition>
            <div class="info-body" v-show="$store.state.groundShowDetail" >
                <ul class="info-msg">
            <li><i></i>地块编号 <span>{{Land.signId}}</span></li>
            <li><i></i>地块类型 <span>{{Land.classify?Land.classify:'标志地块'}}</span></li>
            <li><i></i>地块状态 <span>{{states[Land.state]}}</span></li>
            <li><i></i>起拍价格 <span>{{Land.startPrice}}</span></li>
            <li class="last-price">
              <i></i>最近出价
              <span :class="{active:refreshActive,delay:refreshPriceCount}" @click="refreshPrice"></span>
              <b v-if="refreshPriceCount">{{refreshPriceCount}}s</b>
            </li>
            <div class="price-count" v-if="reTime"><span>剩余竞拍时间: {{reTime}}</span></div>

            <div class="price-list">
              <li v-if="noPriceList" style="font-size:16px;">{{noPriceList}}</li>
              <li v-for="item in priceList" :key="item.userId">
                <span >{{item.walletAddr}} </span>
                <!-- <i v-if="item.walletAddr==$store.state.userInfo.walletAddr">(我)</i> -->
                <!-- <span v-if="item.walletAddr==$store.state.userInfo.walletAddr"> </span> -->
                <!-- <br> -->
                <span v-if="item.price" class="ddc">{{item.price}} DDC</span>
                
                <span>{{new Date(item.priceTime).format('M-dd hh:mm:ss')}}</span>
              </li>
            </div>

            <li class="set-price"><i></i>我要竞拍 <span>最低加价 {{$store.getters.currentGround.minAddPrice}} DDC</span></li>
            <div class="input-p">
              <!-- <el-input class="input-price" placeholder="请输入价格" v-model="inputPrice" clearable></el-input><br/> -->
              <el-input-number v-model="inputPrice" :step="$store.getters.currentGround.minAddPrice" :min="topPrice" readonly="true"></el-input-number>
              <span class="help-text" >{{helpText}}</span>
            </div>
            
                </ul>
                <button :class="{'set-price-btn':true,active:inputActive}" :loading="btnLoading" @click="inputPriceClick()">
                 我要出价
            <i v-if="inputPriceCount">({{inputPriceCount}}s)</i>
            </button>
      </div>
    </el-collapse-transition>
    </div>
</template>

<script>
export default {
    props:["Land"],
    data(){
        return {

        }
    }
};
</script>
<style>

</style>
