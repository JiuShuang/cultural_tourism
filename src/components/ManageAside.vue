<template>
  <div>
    <div class="asideTitle">
      <span style="  color: #8f1d22;font-weight: bold;font-size: 20px">管理系统</span>
    </div>
    <div class="menu" tabindex="2">
      <router-link active-class="active" :to="{name:'UserManage'}"><i class="el-icon-user-solid"></i>用户管理</router-link>
    </div>
    <div class="menu" tabindex="3">
      <router-link active-class="active" :to="{name:'HeritageManage'}"><i class="el-icon-copy-document"></i>非遗管理</router-link>
    </div>
    <div class="menu" tabindex="4">
      <router-link active-class="active" :to="{name:'GoodsManage'}"><i class="el-icon-sell"></i>商品管理</router-link>
    </div>
    <div class="menu" tabindex="5">
      <router-link active-class="active" :to="{name:'OrdersManage'}"><i class="el-icon-s-order"></i>订单管理</router-link>
    </div>
    <div class="menu" tabindex="6">
      <router-link active-class="active" :to="{name:'HotelManage'}"><i class="el-icon-s-home"></i>住宿管理</router-link>
    </div>
    <div class="menu" tabindex="7">
      <router-link active-class="active" :to="{name:'TheaterManage'}"><i class="el-icon-video-camera-solid"></i>剧场管理</router-link>
    </div>
    <div class="menu" tabindex="8">
      <router-link active-class="active" :to="{name:'SceneryManage'}"><i class="el-icon-map-location"></i>景点管理</router-link>
    </div>
    <div class="menu" tabindex="9">
      <router-link active-class="active" :to="{name:'MuseumManage'}"><i class="el-icon-collection"></i>馆藏管理</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ManageAside"
}
</script>

<style scoped>
.asideTitle{
  margin: 40px auto;
}
a>i{
  font-size: 15px;
  margin-right: 15px;
  color: #bc6e37;
}
a{
  text-decoration: none;
  color: #bc6e37;
  font-size: 15px;
  font-weight: bold;
}
.menu{
  text-align: center;
  margin: 8px auto;
  line-height: 45px;
  width: 160px;
  height: 45px;
  border-radius: 5px;
}
.menu:hover a {
  color: #8f1d22;
}
.menu:hover i {
  color: #8f1d22;
}
.menu:hover{
  background: rgba( 255, 255, 255, 0.3 );
}

.active{
  color: #8f1d22;
}
.active i{
  color: #8f1d22;
}

</style>