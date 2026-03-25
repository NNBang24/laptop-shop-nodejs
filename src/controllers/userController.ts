import { Request, Response } from "express"
import { getALlUsers, handleCreateUser, handleDeleteUser, getUserById, handleUpdateUserById, getALlRoles } from "../services/userServices";
import { access } from "fs";
import { getProducts } from "src/services/client/itemServices";

const getHomePage = async (req: Request, res: Response) => {
        const products = await getProducts();
        const user = req.user ; 
        const a = req.user
        console.log(">>> current user" , user)
        return res.render("client/home/show.ejs" , {products});
    
};

const getCreateUserPage = async (req: Request, res: Response) => {
    const roles = await getALlRoles();
    return res.render("admin/user/create.ejs", {
        roles: roles
    });
}
const postCreateUserPage = async (req: Request, res: Response) => {
    // console.log("check data : " , req.body  )
    // return res.render("home.ejs");
    const { fullName, username, phone, role, address } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? "" ;
    //handle create user
    await handleCreateUser(fullName, username, address, phone, avatar , role);
    return res.redirect('/admin/user')
}
const postDeleteUser = async (req: Request, res: Response) => {
    // console.log(req.params.id);
    const { id } = req.params;
    await handleDeleteUser(id)
    return res.redirect('/admin/user')
}
const getViewUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await getUserById(id);
    const roles = await getALlRoles() ;
    return res.render("admin/user/detail", {
        id: id,
        user: user ,
        roles , 
        
    })
}
const postUpdateUser = async (req: Request, res: Response) => {
    const { id ,fullName, phone, role, address } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? undefined;

    // update user 
    await handleUpdateUserById(id, fullName, phone, role, address , avatar);
    return res.redirect('/admin/user')
}
export {
    getHomePage,
    getCreateUserPage,
    postCreateUserPage,
    postDeleteUser,
    getViewUser,
    postUpdateUser
}    