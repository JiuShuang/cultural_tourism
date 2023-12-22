import axios from "axios";
axios.defaults.baseURL='http://localhost:9527/system'
class OrdersApi{
    searchOrders(pageSize,pageNum,type,search){
        return axios.post('/ordersSys/selectPage',{
            pageSize:pageSize,
            pageNum:pageNum,
            param:{
                type:type,
                search:search,
            },
        })
    }

    ordersDetail(ordersID){
        return axios.get('/ordersSys/selectOrders?ordersID='+ordersID)
    }
    delOrders(ordersID){
        return axios.get('/ordersSys/delOrders?ordersID='+ordersID)
    }

    changeStatue(ordersID,ordersStatue){
        return axios.get('/ordersSys/changeStatue?ordersID='+ordersID+'&ordersStatue='+ordersStatue)
    }

}
export default new OrdersApi()