<template>
  <div>
    <div class="dataForm">
      <el-input class="input" v-model="search" placeholder="请输入内容" size="small">
        <el-select v-model="type" slot="prepend" placeholder="请选择">
          <el-option label="馆藏类型" value="馆藏类型"></el-option>
          <el-option label="所在城市" value="所在城市"></el-option>
          <el-option label="馆藏名称" value="馆藏名称"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchMuseum"></el-button>
      </el-input>
      <el-button  class="btn"  plain size="small" @click="openAdd">新增馆藏</el-button>
      <el-button class="btn" size="small" icon="el-icon-refresh" @click="resetData">重置</el-button>
      <el-table
          class="table"
          :data="MuseumData"
          style="width: 100%;height: 400px"
          max-height="400px">
        <el-table-column
            prop="museumCity"
            label="所在城市">
        </el-table-column>
        <el-table-column
            prop="museumCategory"
            label="馆藏类别">
        </el-table-column>
        <el-table-column
            prop="museumName"
            label="馆藏名称"
            :show-overflow-tooltip='true'>
        </el-table-column>
        <el-table-column
            label="馆藏详情">
          <template v-slot="scope">
            <el-link type="primary" :underline="false" @click="openInformation(scope.row)">查看<i class="el-icon-view el-icon--right"></i></el-link>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template v-slot="scope">
            <el-tooltip content="修改馆藏信息" placement="top" effect="dark">
              <el-button icon="el-icon-edit" plain size="mini" @click="openUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除馆藏信息" placement="top" effect="dark">
              <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delMuseum(scope.row)"></el-button>
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
          title="馆藏信息详情"
          :visible.sync="museumInfDrawer"
          :direction="direction">
        <el-carousel height="200px" style="margin: 10px" indicator-position="outside">
          <el-carousel-item v-for="item in fileList" :key="item.name" >
            <el-image :src="item.url"></el-image>
          </el-carousel-item>
        </el-carousel>

        <el-descriptions style="margin: 10px" :column="1" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-wind-power"></i>
              馆藏类别
            </template>
            {{this.MuseumForm.museumCategory}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-postcard"></i>
              馆藏名称
            </template>
            {{this.MuseumForm.museumName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-map-location"></i>
              所在城市
            </template>
            {{this.MuseumForm.museumCity}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location"></i>
              具体地址
            </template>
            {{this.MuseumForm.museumAddress}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-set-up"></i>
              馆藏简介
            </template>
            {{ this.MuseumForm.museumDetail }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-alarm-clock"></i>
              馆藏时间
            </template>
            {{this.MuseumForm.museumTime}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-chat-line-square"></i>
              馆藏评价
            </template>
            {{this.MuseumForm.museumEvaluate}}
          </el-descriptions-item>
        </el-descriptions>
      </el-drawer>

      <el-drawer
          title="添加剧场信息"
          :visible.sync="addMuseumDrawer"
          :direction="direction">
        <el-form ref="form" :model="MuseumForm" label-width="80px">
          <el-form-item label="馆藏类型">
            <el-input  v-model="MuseumForm.museumCategory"></el-input>
          </el-form-item>
          <el-form-item label="馆藏名称">
            <el-input  v-model="MuseumForm.museumName"></el-input>
          </el-form-item>
          <el-form-item label="所在城市">
            <el-input  v-model="MuseumForm.museumCity"></el-input>
          </el-form-item>
          <el-form-item label="具体地址">
            <el-input v-model="MuseumForm.museumAddress"></el-input>
          </el-form-item>
          <el-form-item label="馆藏时间">
            <el-input v-model="MuseumForm.museumTime"></el-input>
          </el-form-item>
          <el-form-item label="馆藏评价">
            <el-input v-model="MuseumForm.museumEvaluate"></el-input>
          </el-form-item>
          <el-form-item label="馆藏简介">
            <el-input type="textarea" v-model="MuseumForm.museumDetail"></el-input>
          </el-form-item>
          <el-form-item label="馆藏照片">
            <el-upload
                action="http://localhost:9527/system/museumSys/uploadMuseumImg"
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
            <el-button type="primary" @click="addMuseum(MuseumForm)" plain size="small">立即添加</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

      <el-drawer
          title="修改馆藏信息"
          :visible.sync="updateMuseumDrawer"
          :direction="direction">
        <el-form ref="form" :model="MuseumForm" label-width="80px">
          <el-form-item label="馆藏类型">
            <el-input  v-model="MuseumForm.museumCategory"></el-input>
          </el-form-item>
          <el-form-item label="馆藏名称">
            <el-input  v-model="MuseumForm.museumName"></el-input>
          </el-form-item>
          <el-form-item label="所在城市">
            <el-input  v-model="MuseumForm.museumCity"></el-input>
          </el-form-item>
          <el-form-item label="具体地址">
            <el-input v-model="MuseumForm.museumAddress"></el-input>
          </el-form-item>
          <el-form-item label="馆藏时间">
            <el-input v-model="MuseumForm.museumTime"></el-input>
          </el-form-item>
          <el-form-item label="馆藏评价">
            <el-input v-model="MuseumForm.museumEvaluate"></el-input>
          </el-form-item>
          <el-form-item label="馆藏简介">
            <el-input type="textarea" v-model="MuseumForm.museumDetail"></el-input>
          </el-form-item>
          <el-form-item label="馆藏照片">
            <el-upload
                action="http://localhost:9527/system/museumSys/uploadMuseumImg"
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
            <el-button type="primary" @click="updateMuseum(MuseumForm)" plain size="small">立即修改</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>

</template>

<script>
import MuseumApi from "@/api/MuseumApi";

export default {
  name: "MuseumManage",
  data(){
    return{
      pageSize:10,
      pageNum:1,
      total:0,
      search:'',
      type:'',
      fileList:[],
      imgPre:'http://localhost:8001/system/museumImg/',
      MuseumData:[],
      addMuseumDrawer:false,
      updateMuseumDrawer:false,
      museumInfDrawer:false,
      direction:'rtl',
      MuseumForm: {
        museumID:'',
        museumName:'',
        museumCategory:'',
        museumCity:'',
        museumAddress:'',
        museumDetail:'',
        museumImg:'',
        museumTime:'',
        museumEvaluate:'',
      },
    }
  },
  methods:{

    handleRemove(file) {
      this.MuseumForm.museumImg=  this.MuseumForm.museumImg.replace(file.name+'/',"")
      MuseumApi.delMuseumImg(file.name).then(res=>res.data).then(res=>{
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
      if (  this.MuseumForm.museumImg==null){
        this.MuseumForm.museumImg=res.data.museumImg+'/'
      }else {
        this.MuseumForm.museumImg =   this.MuseumForm.museumImg
            + res.data.museumImg+'/'
      }
    },

    getFileList(museumImg){
      if (museumImg!=null) {
        let nameList = museumImg.split('/')
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
    openInformation(museum){
      this.museumInfDrawer=true
      this.MuseumForm.museumID=museum.museumID
      this.MuseumForm.museumName=museum.museumName
      this.MuseumForm.museumCategory=museum.museumCategory
      this.MuseumForm.museumCity=museum.museumCity
      this.MuseumForm.museumAddress=museum.museumAddress
      this.MuseumForm.museumDetail=museum.museumDetail
      this.MuseumForm.museumImg=museum.museumImg
      this.MuseumForm.museumTime=museum.museumTime
      this.MuseumForm.museumEvaluate=museum.museumEvaluate
      this.getFileList(museum.museumImg)
    },
    openAdd(){
      this.fileList=[]
      this.MuseumForm.museumID=''
      this.MuseumForm.museumName=''
      this.MuseumForm.museumCategory=''
      this.MuseumForm.museumCity=''
      this.MuseumForm.museumAddress=''
      this.MuseumForm.museumDetail=''
      this.MuseumForm.museumImg=''
      this.MuseumForm.museumTime=''
      this.MuseumForm.museumEvaluate=''
      this.$nextTick(()=>{
        this.addMuseumDrawer=true
      })
    },
    openUpdate(museum){
      this.getFileList(museum.museumImg)
      this.MuseumForm.museumID=museum.museumID
      this.MuseumForm.museumName=museum.museumName
      this.MuseumForm.museumCategory=museum.museumCategory
      this.MuseumForm.museumCity=museum.museumCity
      this.MuseumForm.museumAddress=museum.museumAddress
      this.MuseumForm.museumDetail=museum.museumDetail
      this.MuseumForm.museumImg=museum.museumImg
      this.MuseumForm.museumTime=museum.museumTime
      this.MuseumForm.museumEvaluate=museum.museumEvaluate
      this.$nextTick(()=>{
        this.updateMuseumDrawer=true
      })
    },

    addMuseum(museum){
      MuseumApi.addMuseum(museum).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchMuseum()
          this.addMuseumDrawer=false
          this.$notify({
            title: '添加馆藏信息',
            message: '添加馆藏信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '添加馆藏信息',
            message: '添加馆藏信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    delMuseum(museum){
      MuseumApi.delMuseum(museum).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchMuseum()
          this.$notify({
            title: '删除馆藏信息',
            message: '删除馆藏信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '删除馆藏信息',
            message: '删除馆藏信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    updateMuseum(museum){
      MuseumApi.updateMuseum(museum).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchMuseum()
          this.updateMuseumDrawer=false
          this.$notify({
            title: '修改馆藏信息',
            message: '修改馆藏信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '修改馆藏信息',
            message: '修改馆藏信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },

    searchMuseum(){
      MuseumApi.searchMuseum(this.pageSize,this.pageNum,this.type,this.search).then(res=>res.data).then(res=>{
        this.MuseumData=res.data
        this.total=res.total
      })
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.searchMuseum()
    },
    handleCurrentChange(val) {
      this.pageNum=val
      this.searchMuseum()
    },
    resetData(){
      this.search=''
      this.type=''
      this.searchMuseum()
    },
  },
  mounted() {
    this.searchMuseum()
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