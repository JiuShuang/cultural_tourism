<template>
  <div>
    <div class="dataForm">
      <el-input class="input" v-model="search" placeholder="请输入内容" size="small">
        <el-select v-model="type" slot="prepend" placeholder="请选择">
          <el-option label="景点类型" value="景点类型"></el-option>
          <el-option label="所在城市" value="所在城市"></el-option>
          <el-option label="景点名称" value="景点名称"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchScenery"></el-button>
      </el-input>
      <el-button  class="btn"  plain size="small" @click="openAdd">新增景点</el-button>
      <el-button class="btn" size="small" icon="el-icon-refresh" @click="resetData">重置</el-button>
      <el-table
          class="table"
          :data="SceneryData"
          style="width: 100%;height: 400px"
          max-height="400px">
        <el-table-column
            prop="sceneryCity"
            label="所在城市">
        </el-table-column>
        <el-table-column
            prop="sceneryCategory"
            label="景点类别">
        </el-table-column>
        <el-table-column
            prop="sceneryName"
            label="景点名称">
        </el-table-column>
        <el-table-column
            label="景点详情">
          <template v-slot="scope">
            <el-link type="primary" :underline="false" @click="openInformation(scope.row)">查看<i class="el-icon-view el-icon--right"></i></el-link>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template v-slot="scope">
            <el-tooltip content="修改景点信息" placement="top" effect="dark">
              <el-button icon="el-icon-edit" plain size="mini" @click="openUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除景点信息" placement="top" effect="dark">
              <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delScenery(scope.row)"></el-button>
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
          :visible.sync="sceneryInfDrawer"
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
              景点类别
            </template>
            {{this.SceneryForm.sceneryCategory}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-postcard"></i>
              景点名称
            </template>
            {{this.SceneryForm.sceneryName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-map-location"></i>
              所在城市
            </template>
            {{this.SceneryForm.sceneryCity}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location"></i>
              具体地址
            </template>
            {{this.SceneryForm.sceneryAddress}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-set-up"></i>
              景点简介
            </template>
            {{ this.SceneryForm.sceneryDetail }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-coin"></i>
              景点价格
            </template>
            {{this.SceneryForm.sceneryPrice}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-thumb"></i>
              景点评分
            </template>
            {{this.SceneryForm.sceneryCount}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-chat-line-square"></i>
              景点评价
            </template>
            {{this.SceneryForm.sceneryEvaluate}}
          </el-descriptions-item>
        </el-descriptions>
      </el-drawer>

      <el-drawer
          title="添加剧场信息"
          :visible.sync="addSceneryDrawer"
          :direction="direction">
        <el-form ref="form" :model="SceneryForm" label-width="80px">
          <el-form-item label="景点类型">
            <el-input  v-model="SceneryForm.sceneryCategory"></el-input>
          </el-form-item>
          <el-form-item label="景点名称">
            <el-input  v-model="SceneryForm.sceneryName"></el-input>
          </el-form-item>
          <el-form-item label="所在城市">
            <el-input  v-model="SceneryForm.sceneryCity"></el-input>
          </el-form-item>
          <el-form-item label="具体地址">
            <el-input v-model="SceneryForm.sceneryAddress"></el-input>
          </el-form-item>
          <el-form-item label="景点价格">
            <el-input v-model="SceneryForm.sceneryPrice"></el-input>
          </el-form-item>
          <el-form-item label="景点评分">
            <el-input v-model="SceneryForm.sceneryCount"></el-input>
          </el-form-item>
          <el-form-item label="景点评价">
            <el-input v-model="SceneryForm.sceneryEvaluate"></el-input>
          </el-form-item>
          <el-form-item label="景点简介">
            <el-input type="textarea" v-model="SceneryForm.sceneryDetail"></el-input>
          </el-form-item>
          <el-form-item label="景点照片">
            <el-upload
                action="http://localhost:9527/system/scenerySys/uploadSceneryImg"
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
            <el-button type="primary" @click="addScenery(SceneryForm)" plain size="small">立即添加</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

      <el-drawer
          title="修改景点信息"
          :visible.sync="updateSceneryDrawer"
          :direction="direction">
        <el-form ref="form" :model="SceneryForm" label-width="80px">
          <el-form-item label="景点类型">
            <el-input  v-model="SceneryForm.sceneryCategory"></el-input>
          </el-form-item>
          <el-form-item label="景点名称">
            <el-input  v-model="SceneryForm.sceneryName"></el-input>
          </el-form-item>
          <el-form-item label="所在城市">
            <el-input  v-model="SceneryForm.sceneryCity"></el-input>
          </el-form-item>
          <el-form-item label="具体地址">
            <el-input v-model="SceneryForm.sceneryAddress"></el-input>
          </el-form-item>
          <el-form-item label="景点价格">
            <el-input v-model="SceneryForm.sceneryPrice"></el-input>
          </el-form-item>
          <el-form-item label="景点评分">
            <el-input v-model="SceneryForm.sceneryCount"></el-input>
          </el-form-item>
          <el-form-item label="景点评价">
            <el-input v-model="SceneryForm.sceneryEvaluate"></el-input>
          </el-form-item>
          <el-form-item label="景点简介">
            <el-input type="textarea" v-model="SceneryForm.sceneryDetail"></el-input>
          </el-form-item>
          <el-form-item label="景点照片">
            <el-upload
                action="http://localhost:9527/system/scenerySys/uploadSceneryImg"
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
            <el-button type="primary" @click="updateScenery(SceneryForm)" plain size="small">立即修改</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>

</template>

<script>

import SceneryApi from "@/api/SceneryApi";

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
      imgPre:'http://localhost:8001/system/sceneryImg/',
      SceneryData:[],
      addSceneryDrawer:false,
      updateSceneryDrawer:false,
      sceneryInfDrawer:false,
      direction:'rtl',
      SceneryForm: {
        sceneryID:'',
        sceneryName:'',
        sceneryCategory:'',
        sceneryCity:'',
        sceneryAddress:'',
        sceneryDetail:'',
        sceneryPrice:'',
        sceneryImg:'',
        sceneryEvaluate:'',
        sceneryCount:'',
      },
    }
  },
  methods:{

    handleRemove(file) {
      this.SceneryForm.sceneryImg= this.SceneryForm.sceneryImg.replace(file.name+'/',"")
      SceneryApi.delSceneryImg(file.name).then(res=>res.data).then(res=>{
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
      if ( this.SceneryForm.sceneryImg===null){
        this.SceneryForm.sceneryImg=res.data.sceneryImg+'/'
      }else {
        this.SceneryForm.sceneryImg =  this.SceneryForm.sceneryImg
            + res.data.sceneryImg+'/'
      }
    },

    getFileList(sceneryImg){
      if (sceneryImg!=null) {
        let nameList = sceneryImg.split('/')
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
    openInformation(scenery){
      this.sceneryInfDrawer=true
      this.SceneryForm.sceneryID=scenery.sceneryID
      this.SceneryForm.sceneryName=scenery.sceneryName
      this.SceneryForm.sceneryCategory=scenery.sceneryCategory
      this.SceneryForm.sceneryCity=scenery.sceneryCity
      this.SceneryForm.sceneryAddress=scenery.sceneryAddress
      this.SceneryForm.sceneryDetail=scenery.sceneryDetail
      this.SceneryForm.sceneryPrice=scenery.sceneryPrice
      this.SceneryForm.sceneryImg=scenery.sceneryImg
      this.SceneryForm.sceneryCount=scenery.sceneryCount
      this.SceneryForm.sceneryEvaluate=scenery.sceneryEvaluate
      this.getFileList(scenery.sceneryImg)
    },
    openAdd(){
      this.fileList=[]
      this.SceneryForm.sceneryID=''
      this.SceneryForm.sceneryName=''
      this.SceneryForm.sceneryCategory=''
      this.SceneryForm.sceneryCity=''
      this.SceneryForm.sceneryAddress=''
      this.SceneryForm.sceneryDetail=''
      this.SceneryForm.sceneryPrice=''
      this.SceneryForm.sceneryImg=''
      this.SceneryForm.sceneryCount=''
      this.SceneryForm.sceneryEvaluate=''
      this.$nextTick(()=>{
        this.addSceneryDrawer=true
      })
    },
    openUpdate(scenery){
      this.SceneryForm.sceneryID=scenery.sceneryID
      this.SceneryForm.sceneryName=scenery.sceneryName
      this.SceneryForm.sceneryCategory=scenery.sceneryCategory
      this.SceneryForm.sceneryCity=scenery.sceneryCity
      this.SceneryForm.sceneryAddress=scenery.sceneryAddress
      this.SceneryForm.sceneryDetail=scenery.sceneryDetail
      this.SceneryForm.sceneryPrice=scenery.sceneryPrice
      this.SceneryForm.sceneryImg=scenery.sceneryImg
      this.SceneryForm.sceneryCount=scenery.sceneryCount
      this.SceneryForm.sceneryEvaluate=scenery.sceneryEvaluate
      this.getFileList(scenery.sceneryImg)
      this.$nextTick(()=>{
        this.updateSceneryDrawer=true
      })
    },

    addScenery(scenery){
      SceneryApi.addScenery(scenery).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchScenery()
          this.addSceneryDrawer=false
          this.$notify({
            title: '添加景点信息',
            message: '添加景点信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '添加景点信息',
            message: '添加景点信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    delScenery(scenery){
      SceneryApi.delScenery(scenery).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchScenery()
          this.$notify({
            title: '删除景点信息',
            message: '删除景点信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '删除景点信息',
            message: '删除景点信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    updateScenery(scenery){
      SceneryApi.updateScenery(scenery).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchScenery()
          this.updateSceneryDrawer=false
          this.$notify({
            title: '修改景点信息',
            message: '修改景点信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '修改景点信息',
            message: '修改景点信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },

    searchScenery(){
      SceneryApi.searchScenery(this.pageSize,this.pageNum,this.type,this.search).then(res=>res.data).then(res=>{
        this.SceneryData=res.data
        this.total=res.total
      })
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.searchScenery()
    },
    handleCurrentChange(val) {
      this.pageNum=val
      this.searchScenery()
    },
    resetData(){
      this.search=''
      this.type=''
      this.searchScenery()
    },
  },
  mounted() {
    this.searchScenery()
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