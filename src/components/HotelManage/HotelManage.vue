<template>
  <div>
    <div class="dataForm">
      <el-input class="input" v-model="search" placeholder="请输入内容" size="small">
        <el-select v-model="type" slot="prepend" placeholder="请选择">
          <el-option label="住宿类型" value="住宿类型"></el-option>
          <el-option label="住宿城市" value="住宿城市"></el-option>
          <el-option label="住宿名称" value="住宿名称"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchHotel"></el-button>
      </el-input>
      <el-button  class="btn"  plain size="small" @click="openAdd">新增酒店</el-button>
      <el-button class="btn" size="small" icon="el-icon-refresh" @click="resetData">重置</el-button>
      <el-table
          class="table"
          :data="HotelData"
          style="width: 100%;height: 400px"
          max-height="400px">
        <el-table-column
            prop="hotelCity"
            label="酒店城市">
        </el-table-column>
        <el-table-column
            prop="hotelCategory"
            label="酒店类别">
        </el-table-column>
        <el-table-column
            prop="hotelName"
            label="酒店名称"
            :show-overflow-tooltip='true'>
        </el-table-column>
        <el-table-column
            label="酒店详情">
          <template v-slot="scope">
            <el-link type="primary" :underline="false" @click="openInformation(scope.row)">查看<i class="el-icon-view el-icon--right"></i></el-link>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template v-slot="scope">
            <el-tooltip content="修改酒店信息" placement="top" effect="dark">
              <el-button icon="el-icon-edit" plain size="mini" @click="openUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除酒店信息" placement="top" effect="dark">
              <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delHotel(scope.row)"></el-button>
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
          title="酒店信息详情"
          :visible.sync="hotelInfDrawer"
          :direction="direction"
          >
        <el-carousel height="200px" style="margin: 10px" indicator-position="outside">
          <el-carousel-item v-for="item in fileList" :key="item.name" >
            <el-image :src="item.url"></el-image>
          </el-carousel-item>
        </el-carousel>

        <el-descriptions style="margin: 10px" :column="1" border >
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-school"></i>
              酒店类别
            </template>
            {{this.HotelForm.hotelCategory}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-home"></i>
              酒店名称
            </template>
            {{this.HotelForm.hotelName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-map-location"></i>
              所在城市
            </template>
            {{this.HotelForm.hotelCity}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location"></i>
              具体地址
            </template>
            {{this.HotelForm.hotelAddress}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-coin"></i>
              酒店价格
            </template>
            {{this.HotelForm.hotelPrice}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-thumb"></i>
              酒店评分
            </template>
            {{this.HotelForm.hotelCount}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-chat-line-square"></i>
              酒店评价
            </template>
            {{this.HotelForm.hotelEvaluate}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label" >
              <i class="el-icon-set-up"></i>
              酒店简介
            </template>
            {{ this.HotelForm.hotelDetail }}
          </el-descriptions-item>
        </el-descriptions>
      </el-drawer>

      <el-drawer
          title="添加非遗信息"
          :visible.sync="addHotelDrawer"
          :direction="direction">
        <el-form ref="form" :model="HotelForm" label-width="80px">
          <el-form-item label="酒店类型">
            <el-input  v-model="HotelForm.hotelCategory"></el-input>
          </el-form-item>
          <el-form-item label="酒店名称">
            <el-input  v-model="HotelForm.hotelName"></el-input>
          </el-form-item>
          <el-form-item label="酒店城市">
            <el-input  v-model="HotelForm.hotelCity"></el-input>
          </el-form-item>
          <el-form-item label="具体地址">
            <el-input v-model="HotelForm.hotelAddress"></el-input>
          </el-form-item>
          <el-form-item label="酒店价格">
            <el-input v-model="HotelForm.hotelPrice"></el-input>
          </el-form-item>
          <el-form-item label="酒店评分">
            <el-input v-model="HotelForm.hotelCount"></el-input>
          </el-form-item>
          <el-form-item label="酒店评价">
            <el-input v-model="HotelForm.hotelEvaluate"></el-input>
          </el-form-item>
          <el-form-item label="酒店简介">
            <el-input type="textarea" v-model="HotelForm.hotelDetail"></el-input>
          </el-form-item>
          <el-form-item label="酒店照片">
            <el-upload
                action="http://localhost:9527/system/hotelSys/uploadHotelImg"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="handleBefore"
                :file-list="this.fileList"
                list-type="picture">
              <el-tooltip content="只上传JPG/PNG/JPEG文件且不超过20MB" placement="top" effect="dark">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-tooltip>
            </el-upload>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="addHotel(HotelForm)" plain size="small">立即修改</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

      <el-drawer
          title="修改酒店信息"
          :visible.sync="updateHotelDrawer"
          :direction="direction">
        <el-form ref="form" :model="HotelForm" label-width="80px">
          <el-form-item label="酒店类型">
            <el-input  v-model="HotelForm.hotelCategory"></el-input>
          </el-form-item>
          <el-form-item label="酒店名称">
            <el-input  v-model="HotelForm.hotelName"></el-input>
          </el-form-item>
          <el-form-item label="酒店城市">
            <el-input  v-model="HotelForm.hotelCity"></el-input>
          </el-form-item>
          <el-form-item label="具体地址">
            <el-input v-model="HotelForm.hotelAddress"></el-input>
          </el-form-item>
          <el-form-item label="酒店价格">
            <el-input v-model="HotelForm.hotelPrice"></el-input>
          </el-form-item>
          <el-form-item label="酒店评分">
            <el-input v-model="HotelForm.hotelCount"></el-input>
          </el-form-item>
          <el-form-item label="酒店评价">
            <el-input v-model="HotelForm.hotelEvaluate"></el-input>
          </el-form-item>
          <el-form-item label="酒店简介">
            <el-input type="textarea" v-model="HotelForm.hotelDetail"></el-input>
          </el-form-item>
          <el-form-item label="酒店照片">
            <el-upload
                action="http://localhost:9527/system/hotelSys/uploadHotelImg"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="handleBefore"
                :file-list="this.fileList"
                list-type="picture">
              <el-tooltip content="只上传JPG/PNG/JPEG文件且不超过20MB" placement="top" effect="dark">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-tooltip>
            </el-upload>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="updateHotel(HotelForm)" plain size="small">立即修改</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>

</template>

<script>
import HotelApi from "@/api/HotelApi";

export default {
  name: "HotelManage",
  data(){
    return{
      pageSize:10,
      pageNum:1,
      total:0,
      search:'',
      type:'',
      fileList:[],
      imgPre:'http://localhost:8001/system/hotelImg/',
      HotelData:[],
      addHotelDrawer:false,
      updateHotelDrawer:false,
      hotelInfDrawer:false,
      direction:'rtl',
      HotelForm: {
        hotelID:'',
        hotelName:'',
        hotelCategory:'',
        hotelCity:'',
        hotelAddress:'',
        hotelDetail:'',
        hotelPrice:'',
        hotelImg:'',
        hotelCount:'',
        hotelEvaluate:'',
      },
    }
  },
  methods:{

    handleRemove(file) {
      this.HotelForm.hotelImg=this.HotelForm.hotelImg.replace(file.name+'/',"")
      HotelApi.delHotelImg(file.name).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.$notify({
            title: '删除照片',
            message: '删除照片成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '删除照片',
            message: '删除照片失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    handleBefore(file) {
      const isLt20M = file.size / 1024 / 1024 /1024 < 2;
      if (file.type!=='image/png' && file.type!=='image/jpg' && file.type!=='image/jpeg') {
        this.$message.error('上传的头像只能是 PNG、JPG、JPEG格式!');
        return false
      }
      if (!isLt20M) {
        this.$message.error('上传的头像大小不能超过 20MB!');
        return false
      }
      return true;
    },
    handleSuccess(res){
      if (this.HotelForm.hotelImg==null){
        this.HotelForm.hotelImg=res.data.hotelImg+'/'
      }else {
        this.HotelForm.hotelImg = this.HotelForm.hotelImg
            + res.data.hotelImg+'/'
      }
    },

    getFileList(hotelImg){
      console.log(hotelImg)
      if (hotelImg!=null) {
        let nameList = hotelImg.split('/')
        let fileList = []
        for (const key in nameList) {
          if (nameList[key]!=='') {
            let imgList = {name: nameList[key], url: this.imgPre + nameList[key]}
            fileList.push(imgList)
          }
        }
        this.fileList = fileList
      }else {
        this.fileList=[]
      }
    },
    openInformation(hotel){
      console.log(hotel)
      this.hotelInfDrawer=true
      this.HotelForm.hotelID=hotel.hotelID
      this.HotelForm.hotelName=hotel.hotelName
      this.HotelForm.hotelCategory=hotel.hotelCategory
      this.HotelForm.hotelCity=hotel.hotelCity
      this.HotelForm.hotelAddress=hotel.hotelAddress
      this.HotelForm.hotelDetail=hotel.hotelDetail
      this.HotelForm.hotelPrice=hotel.hotelPrice
      this.HotelForm.hotelImg=hotel.hotelImg
      this.HotelForm.hotelCount=hotel.hotelCount
      this.HotelForm.hotelEvaluate=hotel.hotelEvaluate
      this.getFileList(hotel.hotelImg)
    },
    openAdd(){
      this.fileList=[]
      this.HotelForm.hotelID=''
      this.HotelForm.hotelName=''
      this.HotelForm.hotelCategory=''
      this.HotelForm.hotelCity=''
      this.HotelForm.hotelAddress=''
      this.HotelForm.hotelDetail=''
      this.HotelForm.hotelPrice=''
      this.HotelForm.hotelImg=''
      this.HotelForm.hotelCount=''
      this.HotelForm.hotelEvaluate=''
      this.$nextTick(()=>{
        this.addHotelDrawer=true
      })
    },
    openUpdate(hotel){
      this.getFileList(hotel.hotelImg)
      this.HotelForm.hotelID=hotel.hotelID
      this.HotelForm.hotelName=hotel.hotelName
      this.HotelForm.hotelCategory=hotel.hotelCategory
      this.HotelForm.hotelCity=hotel.hotelCity
      this.HotelForm.hotelAddress=hotel.hotelAddress
      this.HotelForm.hotelDetail=hotel.hotelDetail
      this.HotelForm.hotelPrice=hotel.hotelPrice
      this.HotelForm.hotelImg=hotel.hotelImg
      this.HotelForm.hotelCount=hotel.hotelCount
      this.HotelForm.hotelEvaluate=hotel.hotelEvaluate
      this.$nextTick(()=>{
        this.updateHotelDrawer=true
      })
    },

    addHotel(hotel){
      HotelApi.addHotel(hotel).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchHotel()
          this.addHotelDrawer=false
          this.$notify({
            title: '添加酒店信息',
            message: '添加酒店信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '添加酒店信息',
            message: '添加酒店信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    delHotel(hotel){
      HotelApi.delHotel(hotel).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchHotel()
          this.$notify({
            title: '删除酒店信息',
            message: '删除酒店信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '删除酒店信息',
            message: '删除酒店信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    updateHotel(hotel){
      HotelApi.updateHotel(hotel).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchHotel()
          this.updateHotelDrawer=false
          console.log(hotel)
          this.$notify({
            title: '修改酒店信息',
            message: '修改酒店信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '修改酒店信息',
            message: '修改酒店信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },

    searchHotel(){
      HotelApi.searchHotel(this.pageSize,this.pageNum,this.type,this.search).then(res=>res.data).then(res=>{
        this.HotelData=res.data
        this.total=res.total
      })
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.searchHotel()
    },
    handleCurrentChange(val) {
      this.pageNum=val
      this.searchHotel()
    },
    resetData(){
      this.search=''
      this.type=''
      this.searchHotel()
    },
  },
  mounted() {
    this.searchHotel()
  }
}
</script>

<style>
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
.el-descriptions-item__content {
  max-width: 295px;
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