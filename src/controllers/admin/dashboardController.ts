
import e, { Request, Response } from "express"
import { get } from "http";
import { getOrderAdmin, getOrderDetailAdmin } from "src/services/admin/orderServices";
import { getProductList } from "src/services/admin/productServices";
import { getALlUsers } from "src/services/userServices";

const getDashboardPage = async (req: Request, res: Response) => {


    return res.render("admin/dashboard/show.ejs");
}
const getAdminUserPage = async (req: Request, res: Response) => {
    const users = await getALlUsers();
    return res.render("admin/user/show.ejs" , {
        users : users
    });
}
const getAdminProductPage = async (req: Request, res: Response) => {
    const products = await getProductList()
    return res.render("admin/product/show.ejs" ,
        {products : products}
    );
}
const getAdminOrderPage = async (req: Request, res: Response) => {
    const orders = await getOrderAdmin();

    return res.render("admin/order/show.ejs", {
        orders
    });
}
const getAdminOrderDetailPage = async (req: Request, res: Response) =>{
    const {id} = req.params ;
    const orderDetails = await getOrderDetailAdmin(+id) ;
    return res.render("admin/order/detail.ejs", {
        orderDetails , id
    });
    
}
export {getDashboardPage ,getAdminUserPage , getAdminProductPage , getAdminOrderPage ,getAdminOrderDetailPage}