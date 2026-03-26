import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "src/config/client";
import { getUserSumCart, getUserWithRoleById } from "src/services/client/authServices";
import { comparePassword, getUserById } from "src/services/userServices";

const configPassportLocal = () => {
    passport.use(new LocalStrategy({ passReqToCallback: true }, async function verify(req, username, password, callBack) {
        const { session } = req as any;
        if (session?.messages?.length) {
            session.messages = []
        }
        console.log(">> check username and password ", username, password);

        // check user exist in database 
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (!user) {
            // throw new Error(`Username : ${username} not found` ) ;
            return callBack(null, false, { message: `Username/Password invalid` })
        }
        //compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {

            // throw new Error(`Invalid password not found`) ;
            return callBack(null, false, { message: 'Invalid password ' })
        }
        return callBack(null, user as any);
    }))
    passport.serializeUser(function (user: any, callBack) { //Sau khi login thành công -> Passport sẽ lưu user vào session -> Nhưng không lưu toàn bộ user.

        callBack(null, { id: user.id});

    });

    passport.deserializeUser(async function (user :any, callBack) { //Mỗi request tiếp theo -> Passport sẽ lấy user từ session và gắn vào:
        const {id } = user
        // query to database
        const userInDB : any= await getUserWithRoleById(id) ;
        const sumCart = await getUserSumCart(id) ;
        return callBack(null, {...userInDB, sumCart: sumCart});

    });
}

export default configPassportLocal