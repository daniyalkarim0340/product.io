import {api} from "./axiosinstance.js"

const productApi = {
    addproduct: (data) => {
        return api.post("/addproduct", data)
    },

    getproduct: () => {
        return api.get("/products")
    },

    deleteproduct: (id) => {
        return api.delete(`/product/${id}`)
    },

    updateproduct: (id, data) => {
        return api.put(`/product/${id}`, data)
    },

    getproductbyid: (id) => {
        return api.get(`/product/${id}`)
    }
}

export default productApi;