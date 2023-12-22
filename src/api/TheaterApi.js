import axios from "axios";
axios.defaults.baseURL='http://localhost:9527/system'
class TheaterApi{
    searchTheater(pageSize,pageNum,type,search){
        return axios.post('/theaterSys/selectPage',{
            pageSize:pageSize,
            pageNum:pageNum,
            param:{
                type:type,
                search:search,
            },
        })
    }

    delTheater(theater){
        return axios.post('/theaterSys/delTheater',theater)
    }

    addTheater(theater){
        return axios.post('/theaterSys/addTheater',theater)
    }

    updateTheater(theater){
        return axios.post('/theaterSys/updateTheater',theater)
    }

    delTheaterImg(fileName){
        return axios.get('/theaterSys/delTheaterImg?fileName='+fileName)
    }

}
export default new TheaterApi()