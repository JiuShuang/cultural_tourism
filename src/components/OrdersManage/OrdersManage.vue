<template>
  <div>
    <div class="dataForm">
      <el-input class="input" v-model="search" placeholder="请输入内容" size="small">
        <el-select v-model="type" slot="prepend" placeholder="请选择">
          <el-option label="订单编号" value="订单编号"></el-option>
          <el-option label="订单状态" value="订单状态"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchOrders"></el-button>
      </el-input>
      <el-button class="btn" size="small" icon="el-icon-refresh" @click="resetData">重置</el-button>
      <el-table
          class="table"
          :data="ordersData"
          style="width: 100%;height: 400px"
          max-height="400px">
        <el-table-column
            prop="ordersID"
            label="订单编号"
            :show-overflow-tooltip='true'
        >
        </el-table-column>
        <el-table-column
            prop="ordersDate"
            label="订单日期"
            :show-overflow-tooltip='true'>
        </el-table-column>
        <el-table-column
            prop="ordersMoney"
            label="订单金额"
            :show-overflow-tooltip='true'>
        </el-table-column>
        <el-table-column
            label="订单状态">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.ordersStatue==='已完成'">已完成</el-tag>
            <el-tag type="danger" v-if="scope.row.ordersStatue==='待发货'">{{ scope.row.ordersStatue }}</el-tag>
            <el-tag type="primary" v-if="scope.row.ordersStatue==='待收货'">{{ scope.row.ordersStatue }}</el-tag>
            <el-tag type="warning" v-if="scope.row.ordersStatue==='待评价'">{{ scope.row.ordersStatue }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="订单详情">
          <template v-slot="scope">
            <el-link type="primary" :underline="false" @click="openInformation(scope.row)">查看<i class="el-icon-view el-icon--right"></i></el-link>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template v-slot="scope">
            <el-tooltip content="删除订单信息" placement="top" effect="dark">
              <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delOrders(scope.row.ordersID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>

      <el-drawer
          title="订单详情"
          :visible.sync="ordersInfDrawer"
          :direction="direction">
        <el-descriptions style="padding: 10px" :column="1" border >
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-order"></i>
              订单编号
            </template>
            {{ ordersDetail.ordersID }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-custom"></i>
              购买人
            </template>
            {{ ordersDetail.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user-solid"></i>
              收件人
            </template>
            {{ ordersDetail.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location"></i>
              收件地址
            </template>
            {{ ordersDetail.receiverAddress }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-timer"></i>
              下订时间
            </template>
            {{ ordersDetail.ordersDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-message-solid"></i>
              订单状态
            </template>
            <el-tag type="success" v-if="ordersDetail.ordersStatue==='已完成'">已完成</el-tag>
            <el-tag type="danger" v-if="ordersDetail.ordersStatue==='待发货'">{{ ordersDetail.ordersStatue }}</el-tag>
            <el-tag type="primary" v-if="ordersDetail.ordersStatue==='待收货'">{{ ordersDetail.ordersStatue }}</el-tag>
            <el-tag type="warning" v-if="ordersDetail.ordersStatue==='待评价'">{{ ordersDetail.ordersStatue }}</el-tag>
            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                style="width: 50px"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else style="margin-left: 10px" size="small" @click="showInput">修改状态</el-button>
          </el-descriptions-item>
        </el-descriptions>
        <el-card :body-style="{ padding: '10px' }" style="margin-left: 10px;margin-right: 10px">
          <div slot="header">
            <span>商品列表</span>
          </div>
          <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 10px" v-for="item in goodsDetail" :key="item.length">
            <div style="width: 100%;height: 130px;text-align: left">
            <el-image :src="item.goodsImg" style="width: 40%;height: 120px;float: left;margin: 5px 10px 5px 5px"/>
              <div style="margin:10px 0 8px 0">
                <span style="font-weight: bold">{{item.goodsName}}</span>
                <span style="float: right;margin-right: 20px"><el-tag type="info" size="mini">×{{item.goodsNumber}}</el-tag></span>
              </div>
              <div>
                <span style="color:#999;font-size: 13px;">{{ item.goodsCategory }};{{item.goodsLocation}}</span>
              </div>
              <div style="margin-top: 58px">
                <span style="font-weight: bold;color: coral" >￥{{ item.goodsTotal }}</span>
              </div>
            </div>
          </el-card>

        </el-card>
      </el-drawer>

    </div>
  </div>

</template>

<script>
import OrdersApi from "@/api/OrdersApi";

export default {
  name: "HeritageManage",
  data(){
    return{
      pageSize:10,
      pageNum:1,
      total:0,
      search:'',
      type:'',
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      fileList:[],
      ordersInfDrawer:false,
      imgPre:'http://localhost:8001/system/goodsImg/',
      ordersData:[],
      direction:'rtl',
      goodsDetail: [],
      ordersDetail: {
        ordersID:'',
        ordersDate:'',
        ordersStatue:'',
        ordersMoney:'',
        userName: '',
        name:'',
        receiverAddress:''
      },
    }
  },
  methods:{

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.ordersDetail.ordersStatue=inputValue;
      }
      console.log(this.ordersDetail.ordersStatue)
      OrdersApi.changeStatue(this.ordersDetail.ordersID,this.ordersDetail.ordersStatue).then(res=>res.data).then(res=>{
        this.searchOrders()
        if (res.code===200){
          this.$notify({
            title: '修改订单状态',
            message: '修改订单状态成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '修改订单状态',
            message: '修改订单状态失败',
            type:'error',
            offset: 100
          });
        }
      })
      this.inputVisible = false;
      this.inputValue = '';
    },
    getImg(goodsDetail){
      for (const key in goodsDetail){
        if (goodsDetail[key].goodsImg!=null) {
          let nameList = goodsDetail[key].goodsImg.split('/')
          goodsDetail[key].goodsImg=this.imgPre+nameList[0]
        }
      }
    },
    openInformation(orders){
      this.dynamicTags=[]
      this.ordersInfDrawer=true
      this.ordersDetail.ordersID=orders.ordersID
      this.ordersDetail.ordersDate=orders.ordersDate
      this.ordersDetail.ordersStatue=orders.ordersStatue
      this.ordersDetail.ordersMoney=orders.ordersMoney
      OrdersApi.ordersDetail(orders.ordersID).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.ordersDetail.name=res.data[0].name
          this.ordersDetail.userName=res.data[0].userName
          this.ordersDetail.receiverAddress=res.data[0].province+res.data[0].city+res.data[0].detailAddress
          this.goodsDetail=res.data
          this.dynamicTags.push(this.ordersDetail.ordersStatue)
          this.getImg(this.goodsDetail)
          console.log(this.goodsDetail)
        }
      })
    },
    delOrders(ordersID){
      OrdersApi.delOrders(ordersID).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchOrders()
          this.$notify({
            title: '删除订单信息',
            message: '删除订单信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '删除订单信息',
            message: '删除订单信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    searchOrders(){
      OrdersApi.searchOrders(this.pageSize,this.pageNum,this.type,this.search).then(res=>res.data).then(res=>{
        this.ordersData=res.data
        this.total=res.total
      })
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.searchOrders()
    },
    handleCurrentChange(val) {
      this.pageNum=val
      this.searchOrders()
    },
    resetData(){
      this.search=''
      this.type=''
      this.searchOrders()
    },
  },
  mounted() {
    this.searchOrders()
  }
}
</script>

<style scoped>
.dataForm{
  width: 800px;
  height: 500px;
  margin-top: 10px;
  margin-left: 10px;
  float: left;
  padding: 10px;
  background: rgba( 254, 252, 252, 0.8 );
  border-radius: 15px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
}
.el-tag.is-ready {
  display: none;
}
.el-tag {
  transition: none !important;
}
.el-upload-list__item.is-ready {
  display: none;
}
.el-upload-list__item {
  transition: none !important;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.el-select{
  width: 100px;
}
.el-input{
  width: 300px;
  float: left;
  opacity: 0.8;
}
.btn{
  float: left;
  margin-left: 7px;
}
.btn:hover{
  background-color: rgba( 255, 255, 255, 0.3 );
  transform: scale(1.1);
  transition: all 0.6s;
}
.table{
  margin-top: 20px;
  float: left;
}
.page{
  float: left;
  background-color: rgba( 254, 252, 252, 0.8 );
  opacity: 0.8;
  margin-left: 150px;
}

</style>