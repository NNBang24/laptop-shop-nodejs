import { Request, Response, NextFunction } from "express"
import { User ,Role} from "@prisma/client";
const isLogin = (req: Request, res: Response, next: NextFunction) => {
    const isAuthenticated = req.isAuthenticated();
    if (isAuthenticated) {
       return  res.redirect('/');
    }
    else {
        next()
    }
}
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if(req.path.startsWith('/admin')) {
        const user = req.user;
        if (user?.role?.name === "ADMIN") {
            return next()
        }
        return res.redirect('Status/403');
    }
    //client routes
    next()
};


export {
    isLogin, isAdmin
}