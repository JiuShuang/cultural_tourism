import axios from "axios";
axios.defaults.baseURL='http://localhost:9527/system'
class HeritageApi{
    searchGoods(pageSize,pageNum,type,search){
        return axios.post('/goodsSys/selectPage',{
            pageSize:pageSize,
            pageNum:pageNum,
            param:{
                type:type,
                search:search,
            },
        })
    }

    delGoods(heritage){
        return axios.post('/goodsSys/delGoods',heritage)
    }

    addGoods(heritage){
        return axios.post('/goodsSys/addGoods',heritage)
    }

    updateGoods(heritage){
        return axios.post('/goodsSys/updateGoods',heritage)
    }

    delGoodsImg(fileName){
        return axios.get('/goodsSys/delGoodsImg?fileName='+fileName)
    }

}
export default new HeritageApi()