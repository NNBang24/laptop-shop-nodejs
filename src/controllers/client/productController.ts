import { Request, Response } from "express";
import { getProductById } from "src/services/client/itemServices";

const getProductPage =async( req : Request , res : Response) => {
    const {id} = req.params ; 
    const product = await getProductById(+id)
    return res.render("client/product/detail" , {product})
}

export {
    getProductPage
}