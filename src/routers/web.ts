import express, { Express } from 'express';
import { getCreateUserPage, getHomePage, postCreateUserPage, postDeleteUser, getViewUser, postUpdateUser } from '../controllers/userController';
import { getDashboardPage, getAdminUserPage, getAdminProductPage, getAdminOrderPage } from '../controllers/admin/dashboardController';
import fileUpLoadMiddleware from 'src/middleware/multer';
import { getProductPage } from 'src/controllers/client/productController';
import { getAminCreateProductPage, getViewProduct, postAminCreateProduct, postDeleteProduct, postUpdateProduct } from 'src/controllers/admin/productController';
import { getLoginPage, getRegisterPage, postRegister } from 'src/controllers/client/authController';
import { hashPassword } from 'src/services/userServices';
import passport from 'passport';

const router = express.Router();
const webRouters = (app: Express) => {
    router.get('/',
        getHomePage
    )
    router.get('/product/:id',
        getProductPage
    )
    router.get('/login', getLoginPage);
    router.post('/login' ,passport.authenticate('local' ,{
        successRedirect :'/' ,
        failureRedirect : '/login' ,
        failureMessage : true 
    }))


    router.get('/register', getRegisterPage);
    router.post('/register', postRegister)
    // admin router 
    router.get('/admin', getDashboardPage)
    router.get('/admin/user', getAdminUserPage)
    router.get('/admin/create-user',
        getCreateUserPage
    );
    router.post('/admin/handle-create-user',
        fileUpLoadMiddleware("avatar"),
        postCreateUserPage
    );
    router.post('/admin/delete-user/:id',
        postDeleteUser
    )
    router.get('/admin/view-user/:id',
        getViewUser
    )
    router.post('/admin/update-user',
        fileUpLoadMiddleware("avatar"),
        postUpdateUser
    )
    router.get('/admin/product', getAdminProductPage)
    router.get('/admin/create-product', getAminCreateProductPage);
    router.post('/admin/create-product', fileUpLoadMiddleware("image", "images/product"), postAminCreateProduct);

    router.post("/admin/delete-product/:id", postDeleteProduct);
    router.get("/admin/view-product/:id", getViewProduct);
    router.post("/admin/update-product", fileUpLoadMiddleware("image", "images/product"), postUpdateProduct);

    router.get('/admin/order', getAdminOrderPage)

    app.use('/', router)
}
export default webRouters;

// module.exports = router ;    