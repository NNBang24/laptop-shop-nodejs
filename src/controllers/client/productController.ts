import { time } from "console";
import { Request, Response } from "express";
import { getOrderHistory } from "src/services/admin/orderServices";
import { addProductToCart, getProductById, getProductInCart, updateCartDetailBeforeCheckout, handlePlaceOrder } from "src/services/client/itemServices";

const getProductPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductById(+id)
    return res.render("client/product/detail", { product })
}
const postAddProductToCart = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    if (user) {
        await addProductToCart(1, +id, user)
    }
    else {
        return res.redirect('/login')
    }
    return res.redirect('/')
}
const getCartPage = async (req: Request, res: Response) => {
    const { id } = req.query
    const user = req.user;
    if (!user) {
        return res.redirect('/login')
    }
    const cartDetails = await getProductInCart(+user.id);
    const totalPrice = cartDetails?.map((item) => {
        return +item.price * +item.quantity;
    })?.reduce((a, b) => {
        return a + b
    }, 0) ;
    const cartId = cartDetails.length ? cartDetails[0].cartId : 0
    return res.render('client/product/cart', { cartDetails, totalPrice , cartId})

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

const postHandleCartToCheckout = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.redirect('/login');
    const {cartId} = req.body
    const currentCartDetail: { id: string, quantity: string }[] = req.body?.cartDetails ?? []
    await updateCartDetailBeforeCheckout(currentCartDetail ,cartId)
    return res.redirect('/checkout')
}
const postPlaceOrder = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.redirect('/login');
    const { receiverName, receiverAddress, receiverPhone, totalPrice } = req.body
    await handlePlaceOrder(user.id, receiverName, receiverAddress, receiverPhone, +totalPrice)
    return res.redirect('/thanks')
}
const postThanksPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.redirect('/login');
    return res.render('client/product/thanks')
}

const getOrderHistoryPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.redirect('/login');
    const orders = await getOrderHistory(user.id);
    return res.render('client/product/orderHistory', { orders })
}
const postAddToCartFromDetailPage = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    if (!user) return res.redirect('/login');
    await addProductToCart(+quantity , +id , user)
    return res.redirect(`/product/${id}`)
}
export {
    getProductPage,
    postAddProductToCart,
    getCartPage,
    getCheckOutPage,
    postHandleCartToCheckout,
    postPlaceOrder, postThanksPage,
    getOrderHistoryPage, postAddToCartFromDetailPage
}