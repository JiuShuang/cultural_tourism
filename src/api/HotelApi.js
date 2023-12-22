import axios from "axios";
axios.defaults.baseURL='http://localhost:9527/system'
class HotelApi{
    searchHotel(pageSize,pageNum,type,search){
        return axios.post('/hotelSys/selectPage',{
            pageSize:pageSize,
            pageNum:pageNum,
            param:{
                type:type,
                search:search,
            },
        })
    }

    delHotel(hotel){
        return axios.post('/hotelSys/delHotel',hotel)
    }

    addHotel(hotel){
        return axios.post('/hotelSys/addHotel',hotel)
    }

    updateHotel(hotel){
        return axios.post('/hotelSys/updateHotel',hotel)
    }

    delHotelImg(fileName){
        return axios.get('/hotelSys/delHotelImg?fileName='+fileName)
    }

}
export default new HotelApi()