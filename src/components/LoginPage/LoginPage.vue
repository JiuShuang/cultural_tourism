<template>
  <div class="base">
    <!-- 注册登录界面 -->
    <div  class="loginAndRegister">
      <!--登录表单-->
      <div  class="loginArea">
        <!-- 标语 -->
        <transition
            name="animate__animated animate__bounce"
            enter-active-class="animate__fadeInUp"
            leave-active-class="animate__zoomOut"
            appear
        >
          <div v-show="isShow" class="title">
            LOGIN
          </div>
        </transition>
        <!-- 密码框和用户名框 -->
        <transition
            name="animate__animated animate__bounce"
            enter-active-class="animate__fadeInUp"
            leave-active-class="animate__zoomOut"
            appear
        >
          <div v-show="isShow" class="pwdArea">
            <div style="flex: 1;justify-content: center;display: flex;align-items: center">
              <el-form class="LoginForm" ref="LoginForm" :model="LoginForm"  label-width="80px" >
                <el-form-item label="用户名" prop="userName" style="margin-bottom: 20px;width: 235px">
                  <el-input v-model="LoginForm.userAccount"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" style="margin-top: 20px;width: 235px">
                  <el-input type="password" v-model="LoginForm.userPassword"
                            show-password autocomplete="off" @keyup.e.enter.native="LoginConfirm"></el-input>
                </el-form-item>
              </el-form>
            </div>

          </div>
        </transition>
        <!-- 登录按钮 -->
        <transition
            name="animate__animated animate__bounce"
            enter-active-class="animate__fadeInUp"
            leave-active-class="animate__zoomOut"
            appear
        >
          <div v-show="isShow" class="btnArea">
            <el-button type="success" round style="background-color: #8f1d22;margin-bottom: 70px;letter-spacing: 5px;font-size: 15px;  border: 1px solid #631216"
                       @click="LoginConfirm">登录</el-button>
          </div>
        </transition>
      </div>

      <!-- 注册表单 -->
      <div class="registerArea">
        <!--注册表头-->
        <transition
            name="animate__animated animate__bounce"
            enter-active-class="animate__fadeInUp"
            leave-active-class="animate__zoomOut"
            appear
        >
          <div v-show="!isShow" class="registerTitle">
            用户注册
          </div>
        </transition>
        <!--注册表单-->
        <transition
            name="animate__animated animate__bounce"
            enter-active-class="animate__fadeInUp"
            leave-active-class="animate__zoomOut"
            appear
        >
          <div  v-show="!isShow" class="registerForm">
            <div style="flex: 1;display: flex;justify-content: center;align-items: center">
              <el-form class="RegisterForm" ref="RegisterForm" :model="RegisterForm" label-width="80px">
                <el-form-item label="用户账号" prop="userAccount" class="theLabel">
                  <el-input v-model="RegisterForm.userAccount"></el-input>
                </el-form-item>
                <el-form-item label="用户密码">
                  <el-input type="password" v-model="RegisterForm.userPassword"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                  <el-input v-model="RegisterForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="用户性别">
                  <el-input v-model="RegisterForm.userSex"></el-input>
                </el-form-item>
                <el-form-item label="用户年龄">
                  <el-input v-model="RegisterForm.userAge"></el-input>
                </el-form-item>
                <el-form-item label="用户电话">
                  <el-input v-model="RegisterForm.userPhone"></el-input>
                </el-form-item>
                <el-form-item label="邀请码">
                  <el-input v-model="invitationCode"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </transition>
        <!--注册按钮-->
        <transition
            name="animate__animated animate__bounce"
            enter-active-class="animate__fadeInUp"
            leave-active-class="animate__zoomOut"
            appear
        >
          <div  v-show="!isShow" class="registerBtn">
            <el-button type="success" round style="background-color: #8f1d22;letter-spacing: 5px;  border: 1px solid #631216" @click="RegisterConfirm">注册</el-button>
            <el-button type="success" round style="background-color: #8f1d22;letter-spacing: 5px;  border: 1px solid #631216" @click="resetForm">重置</el-button>
          </div>
        </transition>
      </div>
      <!-- 信息展示界面 -->
      <div id="aaa" class="showInfo"
           :style="{
             borderTopRightRadius:styleObj.bordertoprightradius,
             borderBottomRightRadius:styleObj.borderbottomrightradius,
             borderTopLeftRadius:styleObj.bordertopleftradius,
             borderBottomLeftRadius:styleObj.borderbottomleftradius,
             right:styleObj.rightDis
            }"
           ref="showInfoView">
        <!-- 没有用户输入用户名或者找不到用户名的时候 -->
        <transition
            name="animate__animated animate__bounce"
            enter-active-class="animate__fadeInUp"
            leave-active-class="animate__zoomOut"
            appear
        >
          <div v-show="isShow" style="display: flex;flex-direction: column;align-items: center;justify-content: center;width: 100%;height: 100%">
            <!-- 欢迎语 -->
            <div style="flex: 2;display: flex;align-items: center;font-size: 22px;color: #FFFFFF;font-weight: bold">
              欢迎登入非遗系统
            </div>
            <!-- 欢迎图片 -->
            <div style="flex: 2">
              <el-button type="success"  style="background-color:#8f1d22;border: 1px solid #ffffff;" round @click="changeToRegister">还没有账户？点击注册</el-button>
            </div>
          </div>
        </transition>
        <!-- 用户注册的时候展示信息 -->
        <transition
            name="animate__animated animate__bounce"
            enter-active-class="animate__fadeInUp"
            leave-active-class="animate__zoomOut"
            appear
        >
          <div v-show="!isShow" style="display: flex;flex-direction: column;align-items: center;justify-content: center;width: 100%;height: 100%">
            <!-- 欢迎语 -->
            <div style="flex: 2;display: flex;align-items: center;font-size: 30px;color: #FFFFFF;font-weight: bold">
              欢迎注册
            </div>
            <!-- 欢迎图片 -->
            <div style="flex: 2">
              <el-button type="success"  style="background-color:#8f1d22;border: 1px solid #ffffff;" round @click="changeToLogin">已有账户？点击登录</el-button>
            </div>
          </div>
        </transition>
      </div>

    </div>

  </div>
</template>

<script>
import 'animate.css'
import UserApi from "@/api/UserApi";

export default {

  name:'LoginPage',
  data(){
    return{
      active: 0,
      LoginForm:{
        userAccount:'',
        userPassword:'',
      },
      RegisterForm:{
        userAccount:'',
        userPassword:'',
        userPhone:'',
        userName:'',
        userSex:'',
        userAge:'',
        userRole:"管理员"
      },
      invitationCode:'',
      styleObj:{
        bordertoprightradius:'15px',
        borderbottomrightradius: '15px',
        bordertopleftradius:'0px',
        borderbottomleftradius:'0px',
        rightDis:'0px'
      },
      isShow:true
    }
  },
  methods:{
    changeToRegister(){
      this.styleObj.bordertoprightradius= '0px'
      this.styleObj.borderbottomrightradius='0px'
      this.styleObj.bordertopleftradius='15px'
      this.styleObj.borderbottomleftradius='15px'
      this.styleObj.rightDis='50%'
      this.isShow = !this.isShow
    },
    changeToLogin(){
      this.styleObj.bordertoprightradius= '15px'
      this.styleObj.borderbottomrightradius='15px'
      this.styleObj.bordertopleftradius='0px'
      this.styleObj.borderbottomleftradius='0px'
      this.styleObj.rightDis='0px'
      this.isShow = !this.isShow
    },

    LoginConfirm(){
      UserApi.userLogin(this.LoginForm.userAccount,this.LoginForm.userPassword).then(res=>res.data).then(res=>{
        if(res.code===200){
          this.$router.replace('/TourismManager/UserManage');
          this.$message({
            showClose: true,
            message: '用户登录成功',
            type: 'success'
          });
        }else {
          this.$message({
            showClose: true,
            message: '账号与密码错误或账号无权限登录',
            type: 'error'
          });
        }
      });
    },
    RegisterConfirm(){
      if (this.invitationCode==='909288') {
        UserApi.userRegister(this.RegisterForm).then(res => res.data).then(res => {
          if (res.code === 200) {
            this.changeToLogin()
            this.resetForm()
            this.$message({
              showClose: true,
              message: '用户注册成功',
              type: 'success'
            });
          } else {
            this.$message({
              showClose: true,
              message: '用户注册失败',
              type: 'error'
            });
          }
        });
      }else {
        this.$message({
          showClose: true,
          message: '邀请码错误',
          type: 'error'
        });
      }
    },
    resetForm(){
      this.RegisterForm.userAccount=''
      this.RegisterForm.userPassword=''
      this.RegisterForm.userName=''
      this.RegisterForm.userPhone=''
      this.RegisterForm.userSex=''
      this.RegisterForm.userAge=''
      this.invitationCode=''
    },
  },
}
</script>

<style>
.el-form-item{
  margin-bottom: 10px;
  width: 225px;
}

.el-button:hover{
  border: 1px solid #8f1d22;
}
.base{
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/images/background.jpg");
  background-size: 100%;
}
.loginAndRegister{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.loginArea{
  background-color: rgba(255,255,255,0.8);
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  height: 500px;
  width: 400px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}
.registerArea{
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  height: 500px;
  width: 400px;
  background-color: rgba(255,255,255,0.8);
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content:center ;
  align-items: center;
}
.showInfo{
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  position: absolute;
  height: 500px;
  width: 400px;
  z-index:2;
  top: 0;
  right: 0;
  background-image: url("../../assets/images/welcome.jpg");
  opacity: 0.85;
  background-size: 100%;
}
.title{
  width: 70%;
  flex:1;
  border-bottom: 1px solid #8f1d22;
  display: flex;
  align-items: center;
  color: #8f1d22;
  font-weight: bold;
  font-size: 50px;
  justify-content: center;
}
#aaa{
  transition: 0.3s linear;
}
.pwdArea{
  width: 100%;
  flex:2;
  display: flex;
  flex-direction: column;
}
.pwdArea input{
  outline: none;
  height: 40%;
  border-radius:10px ;
  padding-left: 10px;
  font-size: 20px;
  border: 1px solid #8f1d22;
}
.pwdArea input:focus{
  border: 2px solid #8f1d22;
}

.btnArea{
  flex:1;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.registerTitle{
  width: 70%;
  flex: 1;
  color: #8f1d22;
  font-weight: bold;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #8f1d22;
}
.registerForm{
  flex: 2;
  display: flex;
  flex-direction: column;
  color: #8f1d22;
  font-size: 30px;
}
.registerForm input{
  outline: none;
  height: 15%;
  border-radius:20px ;
  padding-left: 10px;
  font-size: 12px;
  border: 2px solid #8f1d22;
}
.registerForm input:focus{
  border: 2px solid #8f1d22;
}
.registerBtn{
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>