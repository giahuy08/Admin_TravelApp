import axios from 'axios';

let API_URL="https://be-travel.herokuapp.com";

export default function callApi(endpoint, method='GET',body){
    return axios({
        method,
        url:`${API_URL}/${endpoint}`,
        headers:{
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
            "Authorization":"Bearer " + localStorage.getItem("accessToken")
        },
        data:body,
    })
    // .catch(e=>{
    //     console.log(e)
    // })
}


