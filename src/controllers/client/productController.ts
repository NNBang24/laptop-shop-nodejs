import { Request, Response } from "express";
import { addProductToCart, getProductById } from "src/services/client/itemServices";

const getProductPage =async( req : Request , res : Response) => {
    const {id} = req.params ; 
    const product = await getProductById(+id)
    return res.render("client/product/detail" , {product})
}
const postAddProductToCart = async (req: Request, res: Response) => {
    const {id} = req.params ;
    const user =req.user ;
    if(user) {
        await addProductToCart(1, +id, user)
    }
    else {
        return res.redirect('/login')
    }
    return res.redirect('/')
}
const getCartPage = async (req: Request, res: Response) => {
    const user = req.user ;
    if(!user) {
        return res.redirect('/login')
    }
    return res.render('client/product/cart')

}
export {
    getProductPage ,postAddProductToCart , getCartPage
}