import axios from "axios";

axios.get("http://127.0.0.1:12345/get_adj").then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err.response.data);
})