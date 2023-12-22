<template>
  <div>
    <div class="dataForm">
      <el-input class="input" v-model="search" placeholder="请输入内容" size="small">
        <el-select v-model="type" slot="prepend" placeholder="请选择">
          <el-option label="所属市州" value="所属市州"></el-option>
          <el-option label="非遗名称" value="非遗名称"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchHeritage"></el-button>
      </el-input>
      <el-button  class="btn"  plain size="small" @click="openAdd">新增非遗</el-button>
      <el-button class="btn" size="small" icon="el-icon-refresh" @click="resetData">重置</el-button>
      <el-table
          class="table"
          :data="HeritageData"
          style="width: 100%;height: 400px"
          max-height="400px">
        <el-table-column
            prop="heritageCity"
            label="所属市州">
        </el-table-column>
        <el-table-column
            prop="heritageCategory"
            label="非遗类别">
        </el-table-column>
        <el-table-column
            prop="heritageName"
            label="非遗名称">
        </el-table-column>
        <el-table-column
            label="非遗详情">
          <template v-slot="scope">
            <el-link type="primary" :underline="false" @click="openInformation(scope.row)">查看<i class="el-icon-view el-icon--right"></i></el-link>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template v-slot="scope">
            <el-tooltip content="修改非遗信息" placement="top" effect="dark">
              <el-button icon="el-icon-edit" plain size="mini" @click="openUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除非遗信息" placement="top" effect="dark">
              <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delHeritage(scope.row)"></el-button>
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
          title="非遗信息详情"
          :visible.sync="heritageInfDrawer"
          :direction="direction">
        <el-carousel height="200px" style="margin: 10px" indicator-position="outside">
          <el-carousel-item v-for="item in fileList" :key="item.name" >
            <el-image :src="item.url"></el-image>
          </el-carousel-item>
        </el-carousel>

        <el-descriptions style="margin: 10px" :column="1" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-copy-document"></i>
              非遗类别
            </template>
            {{this.HeritageForm.heritageCategory}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-copy-document"></i>
              申遗时间
            </template>
            {{this.HeritageForm.applicationTime}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-copy-document"></i>
              非遗名称
            </template>
            {{this.HeritageForm.heritageName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-information"></i>
              所属市州
            </template>
            {{this.HeritageForm.heritageCity}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-guide"></i>
              非遗地址
            </template>
            {{ this.HeritageForm.heritageAddress }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-postcard"></i>
              非遗简介
            </template>
            {{this.HeritageForm.heritageDetail}}
          </el-descriptions-item>
        </el-descriptions>
      </el-drawer>

      <el-drawer
          title="添加非遗信息"
          :visible.sync="addHeritageDrawer"
          :direction="direction">
        <el-form ref="form" :model="HeritageForm" label-width="80px">
          <el-form-item label="申遗时间">
            <el-input  v-model="HeritageForm.applicationTime"></el-input>
          </el-form-item>
          <el-form-item label="非遗类别">
            <el-input  v-model="HeritageForm.heritageCategory"></el-input>
          </el-form-item>
          <el-form-item label="非遗名称">
            <el-input  v-model="HeritageForm.heritageName"></el-input>
          </el-form-item>
          <el-form-item label="所属市州">
            <el-input v-model="HeritageForm.heritageCity"></el-input>
          </el-form-item>
          <el-form-item label="具体地址">
            <el-input v-model="HeritageForm.heritageAddress"></el-input>
          </el-form-item>
          <el-form-item label="非遗简介">
            <el-input type="textarea" v-model="HeritageForm.heritageDetail"></el-input>
          </el-form-item>
          <el-form-item label="非遗照片">
            <el-upload
                v-if="this.addHeritageDrawer"
                action="http://localhost:9527/system/heritageSys/uploadHeritageImg"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="handleBefore"
                list-type="picture">
              <el-tooltip content="只上传JPG/PNG/JPEG文件且不超过20MB" placement="top" effect="dark">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-tooltip>
            </el-upload>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="addHeritage(HeritageForm)" plain size="small">立即添加</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

      <el-drawer
          title="修改非遗信息"
          :visible.sync="updateHeritageDrawer"
          :direction="direction">
        <el-form ref="form" :model="HeritageForm" label-width="80px">
          <el-form-item label="申遗时间">
            <el-input  v-model="HeritageForm.applicationTime"></el-input>
          </el-form-item>
          <el-form-item label="非遗类别">
            <el-input  v-model="HeritageForm.heritageCategory"></el-input>
          </el-form-item>
          <el-form-item label="非遗名称">
            <el-input  v-model="HeritageForm.heritageName"></el-input>
          </el-form-item>
          <el-form-item label="所属市州">
            <el-input v-model="HeritageForm.heritageCity"></el-input>
          </el-form-item>
          <el-form-item label="具体地址">
            <el-input v-model="HeritageForm.heritageAddress"></el-input>
          </el-form-item>
          <el-form-item label="非遗简介">
            <el-input type="textarea" v-model="HeritageForm.heritageDetail"></el-input>
          </el-form-item>
          <el-form-item label="非遗照片">
            <el-upload
                action="http://localhost:9527/system/heritageSys/uploadHeritageImg"
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
            <el-button type="primary" @click="updateHeritage(HeritageForm)" plain size="small">立即修改</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>

</template>

<script>
import HeritageApi from "@/api/HeritageApi";

export default {
  name: "HeritageManage",
  data(){
    return{
      pageSize:10,
      pageNum:1,
      total:0,
      search:'',
      type:'',
      fileList:[],
      imgPre:'http://localhost:8001/system/heritageImg/',
      HeritageData:[],
      addHeritageDrawer:false,
      updateHeritageDrawer:false,
      heritageInfDrawer:false,
      direction:'rtl',
      HeritageForm: {
        heritageID:'',
        heritageName:'',
        heritageCategory:'',
        heritageCity:'',
        heritageAddress:'',
        heritageDetail:'',
        heritageImg:'',
        applicationTime:'',
      },
    }
  },
  methods:{

    handleRemove(file) {
      this.HeritageForm.heritageImg=this.HeritageForm.heritageImg.replace(file.name+'/',"")
      HeritageApi.delHeritageImg(file.name).then(res=>res.data).then(res=>{
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
      if (this.HeritageForm.heritageImg==null){
        this.HeritageForm.heritageImg=res.data.heritageImg+'/'
      }else {
        this.HeritageForm.heritageImg = this.HeritageForm.heritageImg
            + res.data.heritageImg+'/'
      }
      console.log(this.HeritageForm.heritageImg)
    },

    getFileList(heritageImg){
      if (heritageImg!=null) {
        let nameList = heritageImg.split('/')
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
    openInformation(heritage){
      this.heritageInfDrawer=true
      this.HeritageForm.heritageName=heritage.heritageName
      this.HeritageForm.heritageCity=heritage.heritageCity
      this.HeritageForm.heritageAddress=heritage.heritageAddress
      this.HeritageForm.heritageDetail=heritage.heritageDetail
      this.HeritageForm.applicationTime=heritage.applicationTime
      this.HeritageForm.heritageCategory=heritage.heritageCategory
      this.getFileList(heritage.heritageImg)
    },
    openAdd(){
      this.fileList=[]
      this.HeritageForm.heritageID=''
      this.HeritageForm.heritageName=''
      this.HeritageForm.heritageCity=''
      this.HeritageForm.heritageAddress=''
      this.HeritageForm.heritageDetail=''
      this.HeritageForm.heritageImg=''
      this.HeritageForm.applicationTime=''
      this.HeritageForm.heritageCategory=''
      this.$nextTick(()=>{
        this.addHeritageDrawer=true
      })
    },
    openUpdate(heritage){
      this.getFileList(heritage.heritageImg)
      this.HeritageForm.heritageID=heritage.heritageID
      this.HeritageForm.heritageName=heritage.heritageName
      this.HeritageForm.heritageCity=heritage.heritageCity
      this.HeritageForm.heritageAddress=heritage.heritageAddress
      this.HeritageForm.heritageDetail=heritage.heritageDetail
      this.HeritageForm.heritageImg=heritage.heritageImg
      this.HeritageForm.applicationTime=heritage.applicationTime
      this.HeritageForm.heritageCategory=heritage.heritageCategory
      this.$nextTick(()=>{
        this.updateHeritageDrawer=true
      })
    },

    addHeritage(heritage){
      HeritageApi.addHeritage(heritage).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchHeritage()
          this.addHeritageDrawer=false
          this.$notify({
            title: '添加非遗信息',
            message: '添加非遗信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '添加非遗信息',
            message: '添加非遗信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    delHeritage(heritage){
      HeritageApi.delHeritage(heritage).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchHeritage()
          this.$notify({
            title: '删除用户信息',
            message: '删除用户信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '删除用户信息',
            message: '删除用户信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    updateHeritage(heritage){
      HeritageApi.updateHeritage(heritage).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchHeritage()
          this.updateHeritageDrawer=false
          this.$notify({
            title: '修改非遗信息',
            message: '修改非遗信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '修改非遗信息',
            message: '修改非遗信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },

    searchHeritage(){
      HeritageApi.searchHeritage(this.pageSize,this.pageNum,this.type,this.search).then(res=>res.data).then(res=>{
        this.HeritageData=res.data
        this.total=res.total
      })
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.searchHeritage()
    },
    handleCurrentChange(val) {
      this.pageNum=val
      this.searchHeritage()
    },
    resetData(){
      this.search=''
      this.type=''
      this.searchHeritage()
    },
  },
  mounted() {
    this.searchHeritage()
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