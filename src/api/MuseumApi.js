import axios from "axios";
axios.defaults.baseURL='http://localhost:9527/system'
class MuseumApi{
    searchMuseum(pageSize,pageNum,type,search){
        return axios.post('/museumSys/selectPage',{
            pageSize:pageSize,
            pageNum:pageNum,
            param:{
                type:type,
                search:search,
            },
        })
    }

    delMuseum(museum){
        return axios.post('/museumSys/delMuseum',museum)
    }

    addMuseum(museum){
        return axios.post('/museumSys/addMuseum',museum)
    }

    updateMuseum(museum){
        return axios.post('/museumSys/updateMuseum',museum)
    }

    delMuseumImg(fileName){
        return axios.get('/museumSys/delMuseumImg?fileName='+fileName)
    }

}
export default new MuseumApi()