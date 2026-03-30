import { time } from "console";
import { Request, Response } from "express";
import { addProductToCart, getProductById, getProductInCart } from "src/services/client/itemServices";

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
    const {id} = req.query
    const user = req.user ;
    if(!user) {
        return res.redirect('/login')
    }
   const cartDetails = await getProductInCart(+user.id) ;
   const totalPrice = cartDetails?.map((item) =>{
    return +item.price * +item.quantity ;
   })?.reduce((a,b) =>{
    return a + b
   },0)
    return res.render('client/product/cart' ,{cartDetails , totalPrice})

}
const getCheckOutPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.redirect("/login");

    const cartDetails = await getProductInCart(+user.id);

    const totalPrice = cartDetails?.map(item => +item.price * +item.quantity)
        ?.reduce((a, b) => a + b, 0);

    return res.render("client/product/checkout", {
        cartDetails, totalPrice
    })
}
export {
    getProductPage ,postAddProductToCart , getCartPage , getCheckOutPage
}