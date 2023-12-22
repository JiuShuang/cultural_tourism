import axios from "axios";
axios.defaults.baseURL='http://localhost:9527/system'
class SceneryApi{
    searchScenery(pageSize,pageNum,type,search){
        return axios.post('/scenerySys/selectPage',{
            pageSize:pageSize,
            pageNum:pageNum,
            param:{
                type:type,
                search:search,
            },
        })
    }

    delScenery(scenery){
        return axios.post('/scenerySys/delScenery',scenery)
    }

    addScenery(scenery){
        return axios.post('/scenerySys/addScenery',scenery)
    }

    updateScenery(scenery){
        return axios.post('/scenerySys/updateScenery',scenery)
    }

    delSceneryImg(fileName){
        return axios.get('/hotelSys/delSceneryImg?fileName='+fileName)
    }

}
export default new SceneryApi()