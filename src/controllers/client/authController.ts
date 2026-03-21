import {Request , Response} from "express" ;

import { registerNewUser } from "src/services/client/authServices";
import { RegisterSchema, TRegisterSchema } from "src/validation/registerSchema";


const getRegisterPage = async(req:Request , res :Response) => {
    const errors = [] ;
    const oldData = {
        fullname : '' ,
        email : '' ,
        password : '' ,
        confirmPassword : '' 
    }
    
    return res.render('client/auth/register',{errors , oldData})
}
const getLoginPage = async (req: Request, res: Response) => {
 
    const {session} =req as any  ;
    const messages = session?.messages ?? []
    return res.render('client/auth/login' ,{messages})
}
const postRegister = async(req : Request , res : Response) => {
    const {fullName , email ,password , confirmPassword} = req.body as TRegisterSchema ;
    const validate = await RegisterSchema.safeParseAsync(req.body) ;
    if(!validate.success) {
        const errorsZod = validate.error.issues ;
        const errors = errorsZod?.map(item => {
            return `${item.message} (${item.path[0]})`
        })
        const oldData = {
            fullName , email , password , confirmPassword
        }
        return res.render('client/auth/register', { errors, oldData })
    }
    await registerNewUser(fullName , email ,password)  ;
    return res.redirect("/login")
}
export {
    getLoginPage ,
     getRegisterPage , 
     postRegister 
}