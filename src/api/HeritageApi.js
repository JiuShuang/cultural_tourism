import axios from "axios";
axios.defaults.baseURL='http://localhost:9527/system'
class HeritageApi{
    searchHeritage(pageSize,pageNum,type,search){
        return axios.post('/heritageSys/selectPage',{
            pageSize:pageSize,
            pageNum:pageNum,
            param:{
                type:type,
                search:search,
            },
        })
    }

    delHeritage(heritage){
        return axios.post('/heritageSys/delHeritage',heritage)
    }

    addHeritage(heritage){
        return axios.post('/heritageSys/addHeritage',heritage)
    }

    updateHeritage(heritage){
        return axios.post('/heritageSys/updateHeritage',heritage)
    }

    delHeritageImg(fileName){
        return axios.get('/heritageSys/delHeritageImg?fileName='+fileName)
    }

}
export default new HeritageApi()