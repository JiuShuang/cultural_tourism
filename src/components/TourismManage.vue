<template>
  <div class="manage">
    <el-container>
      <el-aside width="175px">
        <ManageAside></ManageAside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ManageAside from "@/components/ManageAside";
export default {
  name: "TourismManage",
  components:{
    ManageAside
  }
}
</script>

<style scoped>
.manage{
  padding-top: 50px;
  padding-left: 220px;
}
.el-aside{
  height: 600px;
  float: left;
  background: rgba( 255, 255, 255, 0.9 );
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;

}
.el-main{
  width: 900px;
  height: 600px;
  float: left;
  flex: none;
  background: rgba( 255, 252, 252, 0.8 );
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
.manage{
  background-image: url("../assets/images/background.jpg");
  background-size: 100%;
  height: 100vh;
}

</style>