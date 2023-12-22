<template>
  <div>
    <div class="dataForm">
      <el-input class="input" v-model="search" placeholder="请输入内容" size="small">
        <el-select v-model="type" slot="prepend" placeholder="请选择">
          <el-option label="剧场类型" value="剧场类型"></el-option>
          <el-option label="剧场城市" value="剧场城市"></el-option>
          <el-option label="剧场名称" value="剧场名称"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchTheater"></el-button>
      </el-input>
      <el-button  class="btn"  plain size="small" @click="openAdd">新增剧场</el-button>
      <el-button class="btn" size="small" icon="el-icon-refresh" @click="resetData">重置</el-button>
      <el-table
          class="table"
          :data="TheaterData"
          style="width: 100%;height: 400px"
          max-height="400px">
        <el-table-column
            prop="theaterCity"
            label="所在城市">
        </el-table-column>
        <el-table-column
            prop="theaterCategory"
            label="剧场类别">
        </el-table-column>
        <el-table-column
            prop="theaterName"
            label="剧场名称">
        </el-table-column>
        <el-table-column
            label="剧场详情">
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
              <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delTheater(scope.row)"></el-button>
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
          title="剧场信息详情"
          :visible.sync="theaterInfDrawer"
          :direction="direction">
        <el-carousel height="200px" style="margin: 10px" indicator-position="outside">
          <el-carousel-item v-for="item in fileList" :key="item.name" >
            <el-image :src="item.url"></el-image>
          </el-carousel-item>
        </el-carousel>

        <el-descriptions style="margin: 10px" :column="1" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-video-camera"></i>
              剧场类别
            </template>
            {{this.TheaterForm.theaterCategory}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-postcard"></i>
              剧场名称
            </template>
            {{this.TheaterForm.theaterName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-map-location"></i>
              所在城市
            </template>
            {{this.TheaterForm.theaterCity}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location"></i>
              具体地址
            </template>
            {{this.TheaterForm.theaterAddress}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-set-up"></i>
              剧场简介
            </template>
            {{ this.TheaterForm.theaterDetail }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
                <i class="el-icon-coin"></i>
              剧场价格
            </template>
            {{this.TheaterForm.theaterPrice}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-alarm-clock"></i>
              剧场时间
            </template>
            {{this.TheaterForm.theaterTime}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-chat-line-square"></i>
              剧场评价
            </template>
            {{this.TheaterForm.theaterEvaluate}}
          </el-descriptions-item>
        </el-descriptions>
      </el-drawer>

      <el-drawer
          title="添加剧场信息"
          :visible.sync="addTheaterDrawer"
          :direction="direction">
        <el-form ref="form" :model="TheaterForm" label-width="80px">
          <el-form-item label="剧场类型">
            <el-input  v-model="TheaterForm.theaterCategory"></el-input>
          </el-form-item>
          <el-form-item label="剧场名称">
            <el-input  v-model="TheaterForm.theaterName"></el-input>
          </el-form-item>
          <el-form-item label="所在城市">
            <el-input  v-model="TheaterForm.theaterCity"></el-input>
          </el-form-item>
          <el-form-item label="具体地址">
            <el-input v-model="TheaterForm.theaterAddress"></el-input>
          </el-form-item>
          <el-form-item label="剧场价格">
            <el-input v-model="TheaterForm.theaterPrice"></el-input>
          </el-form-item>
          <el-form-item label="剧场时间">
            <el-input v-model="TheaterForm.theaterTime"></el-input>
          </el-form-item>
          <el-form-item label="剧场评价">
            <el-input v-model="TheaterForm.theaterEvaluate"></el-input>
          </el-form-item>
          <el-form-item label="剧场简介">
            <el-input type="textarea" v-model="TheaterForm.theaterDetail"></el-input>
          </el-form-item>
          <el-form-item label="剧场照片">
            <el-upload
                action="http://localhost:9527/system/theaterSys/uploadTheaterImg"
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
            <el-button type="primary" @click="addTheater(TheaterForm)" plain size="small">立即添加</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

      <el-drawer
          title="修改剧场信息"
          :visible.sync="updateTheaterDrawer"
          :direction="direction">
        <el-form ref="form" :model="TheaterForm" label-width="80px">
          <el-form-item label="剧场类型">
            <el-input  v-model="TheaterForm.theaterCategory"></el-input>
          </el-form-item>
          <el-form-item label="剧场名称">
            <el-input  v-model="TheaterForm.theaterName"></el-input>
          </el-form-item>
          <el-form-item label="所在城市">
            <el-input  v-model="TheaterForm.theaterCity"></el-input>
          </el-form-item>
          <el-form-item label="具体地址">
            <el-input v-model="TheaterForm.theaterAddress"></el-input>
          </el-form-item>
          <el-form-item label="剧场价格">
            <el-input v-model="TheaterForm.theaterPrice"></el-input>
          </el-form-item>
          <el-form-item label="剧场时间">
            <el-input v-model="TheaterForm.theaterTime"></el-input>
          </el-form-item>
          <el-form-item label="剧场评价">
            <el-input v-model="TheaterForm.theaterEvaluate"></el-input>
          </el-form-item>
          <el-form-item label="剧场简介">
            <el-input type="textarea" v-model="TheaterForm.theaterDetail"></el-input>
          </el-form-item>
          <el-form-item label="剧场照片">
            <el-upload
                action="http://localhost:9527/system/theaterSys/uploadTheaterImg"
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
            <el-button type="primary" @click="updateTheater(TheaterForm)" plain size="small">立即修改</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>

</template>

<script>

import TheaterApi from "@/api/TheaterApi";

export default {
  name: "TheaterManage",
  data(){
    return{
      pageSize:10,
      pageNum:1,
      total:0,
      search:'',
      type:'',
      fileList:[],
      imgPre:'http://localhost:8001/system/theaterImg/',
      TheaterData:[],
      addTheaterDrawer:false,
      updateTheaterDrawer:false,
      theaterInfDrawer:false,
      direction:'rtl',
      TheaterForm: {
        theaterID:'',
        theaterName:'',
        theaterCategory:'',
        theaterCity:'',
        theaterAddress:'',
        theaterDetail:'',
        theaterPrice:'',
        theaterImg:'',
        theaterTime:'',
        theaterEvaluate:'',
      },
    }
  },
  methods:{

    handleRemove(file) {
      this.TheaterForm.theaterImg= this.TheaterForm.theaterImg.replace(file.name+'/',"")
      TheaterApi.delTheaterImg(file.name).then(res=>res.data).then(res=>{
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
      if ( this.TheaterForm.theaterImg==null){
        this.TheaterForm.theaterImg=res.data.theaterImg+'/'
      }else {
        this.TheaterForm.theaterImg =  this.TheaterForm.theaterImg
            + res.data.theaterImg+'/'
      }
    },

    getFileList(theaterImg){
      if (theaterImg!=null) {
        let nameList = theaterImg.split('/')
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
    openInformation(theater){
      this.theaterInfDrawer=true
      this.TheaterForm.theaterID=theater.theaterID
      this.TheaterForm.theaterName=theater.theaterName
      this.TheaterForm.theaterCategory=theater.theaterCategory
      this.TheaterForm.theaterCity=theater.theaterCity
      this.TheaterForm.theaterAddress=theater.theaterAddress
      this.TheaterForm.theaterDetail=theater.theaterDetail
      this.TheaterForm.theaterPrice=theater.theaterPrice
      this.TheaterForm.theaterImg=theater.theaterImg
      this.TheaterForm.theaterTime=theater.theaterTime
      this.TheaterForm.theaterEvaluate=theater.theaterEvaluate
      this.getFileList(theater.theaterImg)
    },
    openAdd(){
      this.fileList=[]
      this.TheaterForm.theaterID=''
      this.TheaterForm.theaterName=''
      this.TheaterForm.theaterCategory=''
      this.TheaterForm.theaterCity=''
      this.TheaterForm.theaterAddress=''
      this.TheaterForm.theaterDetail=''
      this.TheaterForm.theaterPrice=''
      this.TheaterForm.theaterImg=''
      this.TheaterForm.theaterTime=''
      this.TheaterForm.theaterEvaluate=''
      this.$nextTick(()=>{
        this.addTheaterDrawer=true
      })
    },
    openUpdate(theater){
      this.getFileList(theater.theaterImg)
      this.TheaterForm.theaterID=theater.theaterID
      this.TheaterForm.theaterName=theater.theaterName
      this.TheaterForm.theaterCategory=theater.theaterCategory
      this.TheaterForm.theaterCity=theater.theaterCity
      this.TheaterForm.theaterAddress=theater.theaterAddress
      this.TheaterForm.theaterDetail=theater.theaterDetail
      this.TheaterForm.theaterPrice=theater.theaterPrice
      this.TheaterForm.theaterImg=theater.theaterImg
      this.TheaterForm.theaterTime=theater.theaterTime
      this.TheaterForm.theaterEvaluate=theater.theaterEvaluate
      this.$nextTick(()=>{
        this.updateTheaterDrawer=true
      })
    },

    addTheater(theater){
      TheaterApi.addTheater(theater).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchTheater()
          this.addTheaterDrawer=false
          this.$notify({
            title: '添加剧场信息',
            message: '添加剧场信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '添加剧场信息',
            message: '添加剧场信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    delTheater(theater){
      TheaterApi.delTheater(theater).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchTheater()
          this.$notify({
            title: '删除剧场信息',
            message: '删除剧场信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '删除剧场信息',
            message: '删除剧场信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    updateTheater(theater){
      TheaterApi.updateTheater(theater).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchTheater()
          this.updateTheaterDrawer=false
          this.$notify({
            title: '修改剧场信息',
            message: '修改剧场信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '修改剧场信息',
            message: '修改剧场信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },

    searchTheater(){
      TheaterApi.searchTheater(this.pageSize,this.pageNum,this.type,this.search).then(res=>res.data).then(res=>{
        this.TheaterData=res.data
        this.total=res.total
      })
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.searchTheater()
    },
    handleCurrentChange(val) {
      this.pageNum=val
      this.searchTheater()
    },
    resetData(){
      this.search=''
      this.type=''
      this.searchTheater()
    },
  },
  mounted() {
    this.searchTheater()
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