import {api} from "./axiosinstance.js"
const authApi={
   register:
       (data)=>{
           return api.post("/register",data)
       }
    ,
    login:(data)=>{
        return api.post("/login",data)
    },
    refreshToken:()=>{
        return api.post("/generateaccesstoken")
    },
    Logoutuser:()=>{
        return api.get("/logout")
    }
}
export default authApi
