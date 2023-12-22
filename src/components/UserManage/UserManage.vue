<template>
  <div>
    <div class="dataForm">
      <el-input class="input" v-model="search" placeholder="请输入内容" size="small">
        <el-select v-model="type" clearable slot="prepend" placeholder="请选择">
          <el-option label="用户昵称" value="用户昵称"></el-option>
          <el-option label="用户账号" value="用户账号"></el-option>
          <el-option label="用户权限" value="用户权限"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
      </el-input>
      <el-button icon="el-icon-refresh" style="float: left;margin-left: 10px" size="small" @click="resetData">重置</el-button>
      <el-table
          class="table"
          :data="userData"
          style="width: 100%;height: 400px"
          max-height="400px">
        <el-table-column
            prop="userAccount"
            label="用户账号">
        </el-table-column>
        <el-table-column
            prop="userName"
            label="用户昵称">
        </el-table-column>
        <el-table-column
            prop="userPhone"
            label="用户电话">
        </el-table-column>
        <el-table-column
            prop="userRole"
            label="用户权限">
        </el-table-column>
        <el-table-column
            label="信息详情">
          <template v-slot="scope">
            <el-link type="primary" :underline="false" @click="openInformation(scope.row)">查看<i class="el-icon-view el-icon--right"></i></el-link>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template v-slot="scope">
            <el-tooltip content="修改用户" placement="top" effect="dark">
            <el-button icon="el-icon-edit" plain size="mini" @click="openUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除用户信息" placement="top" effect="dark">
            <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delUser(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-drawer
          title="用户信息详情"
          :visible.sync="userInfDrawer"
          :direction="direction">
        <el-descriptions style="padding: 10px" :column="1" border>
          <template slot="extra">
          <el-avatar :size="100" :src=this.avatarPre+userForm.userAvatar style="margin-right: 180px"></el-avatar>
          </template>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-custom"></i>
              用户昵称
            </template>
            {{this.userForm.userName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-promotion"></i>
              用户账号
            </template>
            {{this.userForm.userAccount}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-phone"></i>
              用户电话
            </template>
            {{ this.userForm.userPhone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-open"></i>
              用户年龄
            </template>
            {{this.userForm.userAge}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-male" v-if="this.userForm.userSex==='男'"></i>
              <i class="el-icon-female" v-if="this.userForm.userSex==='女'"></i>
              用户性别
            </template>
            {{this.userForm.userSex}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-flag"></i>
              用户权限
            </template>
            <el-tag v-if="this.userForm.userRole==='普通用户'">{{this.userForm.userRole}}</el-tag>
            <el-tag v-if="this.userForm.userRole==='管理员'" type="danger">{{this.userForm.userRole}}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-order"></i>
              用户简介
            </template>
            {{this.userForm.userDetail}}
          </el-descriptions-item>
        </el-descriptions>
      </el-drawer>

      <el-drawer
          title="修改用户信息"
          :visible.sync="updateUserDrawer"
          :direction="direction">
        <el-form ref="form" :model="userForm" label-width="80px">
          <el-upload
              action="http://localhost:9527/system/userSys/uploadAvatar"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <el-avatar :size="80" :src=this.avatarPre+userForm.userAvatar></el-avatar>
          </el-upload>

          <el-form-item label="用户昵称">
          <el-input class="nameInput" v-model="userForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="用户电话">
            <el-input v-model="userForm.userPhone"></el-input>
          </el-form-item>
          <el-form-item label="用户账号">
            <el-input v-model="userForm.userAccount"></el-input>
          </el-form-item>
          <el-form-item label="用户密码">
            <el-input v-model="userForm.userPassword"></el-input>
          </el-form-item>
          <el-form-item label="用户年龄">
            <el-input v-model="userForm.userAge"></el-input>
          </el-form-item>
          <el-form-item label="用户性别">
            <el-radio class="radioOne" v-model="userForm.userSex" label="男"><i class="el-icon-male"></i>  男</el-radio>
            <el-radio class="radioOne" v-model="userForm.userSex" label="女"><i class="el-icon-female"></i>  女</el-radio>
          </el-form-item>
          <el-form-item label="用户权限">
            <el-radio class="radioTwo" v-model="userForm.userRole" label="管理员" border size="medium">管理员</el-radio>
            <el-radio class="radioTwo" v-model="userForm.userRole" label="普通用户" border size="medium">普通用户</el-radio>
          </el-form-item>
          <el-form-item label="用户简介">
            <el-input type="textarea" v-model="userForm.userDetail"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="updateUser(userForm)" plain size="small">立即修改</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

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
    </div>
  </div>
</template>

<script>
import UserApi from "@/api/UserApi";

export default {
  name: "UserManage",
  data(){
    return{
      search:'',
      type:'',
      pageSize:10,
      pageNum:1,
      total:0,
      updateUserDrawer:false,
      userInfDrawer:false,
      direction:'rtl',
      avatarPre:'http://localhost:8001/system/userAvatar/',
      userData: [],
      userForm: {
        userID:'',
        userAccount:'',
        userPassword:'',
        userPhone:'',
        userName:'',
        userSex:'',
        userAge:'',
        userRole:'',
        userDetail:'',
        userAvatar:''
      }
    }
  },
  methods:{
    beforeAvatarUpload(file) {
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
    handleAvatarSuccess(res){
      this.$notify({
        title: '上传头像',
        message: '上传头像成功',
        type:'success',
        offset: 100,
        position: 'bottom-right'
      })
      this.userForm.userAvatar=res.data.userAvatar
    },
    openUpdate(user){
      this.updateUserDrawer=true
      this.userForm.userID=user.userID
      this.userForm.userAccount=user.userAccount
      this.userForm.userPassword=user.userPassword
      this.userForm.userPhone=user.userPhone
      this.userForm.userName=user.userName
      this.userForm.userSex=user.userSex
      this.userForm.userAge=user.userAge
      this.userForm.userRole=user.userRole
      this.userForm.userDetail=user.userDetail
      this.userForm.userAvatar=user.userAvatar
    },
    openInformation(user){
      this.userInfDrawer=true
      this.userForm.userID=user.userID
      this.userForm.userAccount=user.userAccount
      this.userForm.userPassword=user.userPassword
      this.userForm.userPhone=user.userPhone
      this.userForm.userName=user.userName
      this.userForm.userSex=user.userSex
      this.userForm.userAge=user.userAge
      this.userForm.userRole=user.userRole
      this.userForm.userDetail=user.userDetail
      this.userForm.userAvatar=user.userAvatar
    },
    delUser(user){
      UserApi.delUser(user).then(res=>res.data).then(res=>{
        this.searchUser()
        if (res.code===200){
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
    updateUser(user){
      UserApi.updateUser(user).then(res=>res.data).then(res=>{
        this.searchUser()
        this.updateUserDrawer=false
        if (res.code===200){
          this.$notify({
            title: '修改用户信息',
            message: '修改用户信息成功',
            type:'success',
            offset: 100
          });
        }else {
          this.$notify({
            title: '修改用户信息',
            message: '修改用户信息失败',
            type:'error',
            offset: 100
          });
        }
      })
    },
    searchUser(){
      UserApi.searchUser(this.pageSize,this.pageNum,this.type,this.search).then(res=>res.data).then(res=>{
        this.userData=res.data
        this.total=res.total
      })
    },
    resetData(){
      this.search=''
      this.type=''
      this.searchUser()
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.searchUser()
    },
    handleCurrentChange(val) {
      this.pageNum=val
      this.searchUser()
    },
  },
  beforeMount() {
    this.searchUser()
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
.el-select{
  width: 100px;
}

.radioOne{
  float: left;
  margin-right: 30px;
  margin-left: 10px;
  margin-top: 10px;
}
.radioTwo{
  float: left;
  margin-right: 3px;
}
.el-input{
  width: 350px;
  float: left;
  opacity: 0.8;
}
.btn{
  float: left;
  margin-left: 20px;
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