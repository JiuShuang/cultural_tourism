<template>
  <div>
    <div class="dataForm">
      <el-input class="input" v-model="search" placeholder="请输入内容" size="small">
        <el-select v-model="type" slot="prepend" placeholder="请选择">
          <el-option label="商品类型" value="商品类型"></el-option>
          <el-option label="商品名称" value="商品名称"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
      </el-input>
      <el-button  class="btn"  plain size="small" @click="openAdd">新增商品</el-button>
      <el-button class="btn" size="small" icon="el-icon-refresh" @click="resetData">重置</el-button>
      <el-table
          class="table"
          :data="goodsData"
          style="width: 100%;height: 400px"
          max-height="400px">、
        <el-table-column
            prop="goodsCategory"
            label="商品店铺">
        </el-table-column>
        <el-table-column
            prop="goodsCategory"
            label="商品类别">
        </el-table-column>
        <el-table-column
            prop="goodsLocation"
            label="发货地">
        </el-table-column>
        <el-table-column
            prop="goodsName"
            label="商品名称">
        </el-table-column>
        <el-table-column
            label="商品详情">
          <template v-slot="scope">
            <el-link type="primary" :underline="false" @click="openInformation(scope.row)">查看<i class="el-icon-view el-icon--right"></i></el-link>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template v-slot="scope">
            <el-tooltip content="修改商品信息" placement="top" effect="dark">
              <el-button icon="el-icon-edit" plain size="mini" @click="openUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除商品信息" placement="top" effect="dark">
              <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delGoods(scope.row)"></el-button>
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
          title="商品信息详情"
          :visible.sync="goodsInfDrawer"
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
              商品店铺
            </template>
            {{this.goodsForm.goodsStore}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-copy-document"></i>
              商品类别
            </template>
            {{this.goodsForm.goodsCategory}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-information"></i>
              商品名称
            </template>
            {{this.goodsForm.goodsName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-guide"></i>
              发货地
            </template>
            {{ this.goodsForm.goodsLocation }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-guide"></i>
              商品价格
            </template>
            {{ this.goodsForm.goodsPrice }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-postcard"></i>
              商品简介
            </template>
            {{this.goodsForm.goodsDetail}}
          </el-descriptions-item>
        </el-descriptions>
      </el-drawer>

      <el-drawer
          title="添加商品信息"
          :visible.sync="addGoodsDrawer"
          :direction="direction">
        <el-form ref="form" :model="goodsForm" label-width="80px">
          <el-form-item label="商品店铺">
            <el-input  v-model="goodsForm.goodsStore"></el-input>
          </el-form-item>
          <el-form-item label="商品类别">
            <el-input  v-model="goodsForm.goodsCategory"></el-input>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="goodsForm.goodsName"></el-input>
          </el-form-item>
          <el-form-item label="发货地">
            <el-input v-model="goodsForm.goodsLocation"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsForm.goodsPrice"></el-input>
          </el-form-item>
          <el-form-item label="商品简介">
            <el-input type="textarea" v-model="goodsForm.goodsDetail"></el-input>
          </el-form-item>
          <el-form-item label="商品照片">
            <el-upload
                v-if="this.addGoodsDrawer"
                action="http://localhost:9527/system/goodsSys/uploadGoodsImg"
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
            <el-button type="primary" @click="addGoods(goodsForm)" plain size="small">立即添加</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

      <el-drawer
          title="修改商品信息"
          :visible.sync="updateGoodsDrawer"
          :direction="direction">
        <el-form ref="form" :model="goodsForm" label-width="80px">
          <el-form-item label="商品店铺">
            <el-input  v-model="goodsForm.goodsStore"></el-input>
          </el-form-item>
          <el-form-item label="商品类别">
            <el-input  v-model="goodsForm.goodsCategory"></el-input>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="goodsForm.goodsName"></el-input>
          </el-form-item>
          <el-form-item label="发货地">
            <el-input v-model="goodsForm.goodsLocation"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsForm.goodsPrice"></el-input>
          </el-form-item>
          <el-form-item label="商品简介">
            <el-input type="textarea" v-model="goodsForm.goodsDetail"></el-input>
          </el-form-item>
          <el-form-item label="非遗照片">
            <el-upload
                action="http://localhost:9527/system/goodsSys/uploadGoodsImg"
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
            <el-button type="primary" @click="updateGoods(goodsForm)" plain size="small">立即修改</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>

</template>

<script>
import GoodsApi from "@/api/GoodsApi";

export default {
  name: "GoodsManage",
  data(){
    return{
      pageSize:10,
      pageNum:1,
      total:0,
      search:'',
      type:'',
      fileList:[],
      imgPre:'http://localhost:8001/system/goodsImg/',
      goodsData:[],
      addGoodsDrawer:false,
      updateGoodsDrawer:false,
      goodsInfDrawer:false,
      direction:'rtl',
      goodsForm: {
        goodsID:'',
        goodsName:'',
        goodsStore:'',
        goodsCategory:'',
        goodsImg:'',
        goodsDetail:'',
        goodsPrice:'',
        goodsLocation:''
      },
    }
  },
  methods:{

    handleRemove(file) {
      this.goodsForm.goodsImg=this.goodsForm.goodsImg.replace(file.name+'/',"")
      GoodsApi.delGoodsImg(file.name).then(res=>res.data).then(res=>{
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
      if (this.goodsForm.goodsImg==null){
        this.goodsForm.goodsImg=res.data.goodsImg+'/'
      }else {
        this.goodsForm.goodsImg = this.goodsForm.goodsImg + res.data.goodsImg+'/'
      }
      console.log(this.goodsForm.goodsImg)
    },

    getFileList(goodsImg){
      if (goodsImg!=null) {
        let nameList = goodsImg.split('/')
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
    openInformation(goods){
      this.goodsInfDrawer=true
      this.getFileList(goods.goodsImg)
      this.goodsForm.goodsID=goods.goodsID
      this.goodsForm.goodsStore=goods.goodsStore
      this.goodsForm.goodsCategory=goods.goodsCategory
      this.goodsForm.goodsName=goods.goodsName
      this.goodsForm.goodsImg=goods.goodsImg
      this.goodsForm.goodsDetail=goods.goodsDetail
      this.goodsForm.goodsPrice=goods.goodsPrice
      this.goodsForm.goodsLocation=goods.goodsLocation
    },
    openAdd(){
      this.addGoodsDrawer=true
      this.fileList=[]
      this.goodsForm.goodsID=''
      this.goodsForm.goodsStore=''
      this.goodsForm.goodsCategory=''
      this.goodsForm.goodsName=''
      this.goodsForm.goodsImg=''
      this.goodsForm.goodsDetail=''
      this.goodsForm.goodsPrice=''
      this.goodsForm.goodsLocation=''
    },
    openUpdate(goods){
      this.getFileList(goods.goodsImg)
      this.goodsForm.goodsID=goods.goodsID
      this.goodsForm.goodsStore=goods.goodsStore
      this.goodsForm.goodsCategory=goods.goodsCategory
      this.goodsForm.goodsName=goods.goodsName
      this.goodsForm.goodsImg=goods.goodsImg
      this.goodsForm.goodsDetail=goods.goodsDetail
      this.goodsForm.goodsPrice=goods.goodsPrice
      this.goodsForm.goodsLocation=goods.goodsLocation
      this.$nextTick(()=>{
        this.updateGoodsDrawer=true
      })
    },

    addGoods(goods){
      console.log(goods)
      GoodsApi.addGoods(goods).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchGoods()
          this.addGoodsDrawer=false
          this.$notify({
            title: '添加商品信息',
            message: '添加商品信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '添加商品信息',
            message: '添加商品信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    delGoods(goods){
      GoodsApi.delGoods(goods).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchGoods()
          this.$notify({
            title: '删除商品信息',
            message: '删除商品信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '删除商品信息',
            message: '删除商品信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    updateGoods(goods){
      GoodsApi.updateGoods(goods).then(res=>res.data).then(res=>{
        if (res.code===200){
          this.searchGoods()
          this.updateGoodsDrawer=false
          this.$notify({
            title: '修改商品信息',
            message: '修改商品信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '修改商品信息',
            message: '修改商品信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },

    searchGoods(){
      GoodsApi.searchGoods(this.pageSize,this.pageNum,this.type,this.search).then(res=>res.data).then(res=>{
        this.goodsData=res.data
        this.total=res.total
      })
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.searchGoods()
    },
    handleCurrentChange(val) {
      this.pageNum=val
      this.searchGoods()
    },
    resetData(){
      this.search=''
      this.type=''
      this.searchGoods()
    },
  },
  mounted() {
    this.searchGoods()
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