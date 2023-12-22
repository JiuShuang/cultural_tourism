import axios from "axios";
axios.defaults.baseURL='http://localhost:9527/system'
class UserApi{
    searchUser(pageSize,pageNum,type,search){
        return axios.post('/userSys/selectPage',{
            pageSize:pageSize,
            pageNum:pageNum,
            param:{
                type:type,
                search:search,
            },
        })
    }

    delUser(user){
        return axios.post('/userSys/delUser',user)
    }

    updateUser(user){
        return axios.post('/userSys/updateUser',user)
    }

    userLogin(userAccount,userPassword){
        return axios.get('/userSys/userLogin?userAccount='+userAccount+'&userPassword='+userPassword)
    }

    userRegister(user){
        return axios.post('/userSys/userRegister',user)
    }

}
export default new UserApi()