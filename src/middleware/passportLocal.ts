import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "src/config/client";
import { comparePassword } from "src/services/userServices";

const configPassportLocal = () => {
    passport.use(new LocalStrategy(async function verify(username, password, callBack) {
        console.log(">> check username and password ", username, password);

        // check user exist in database 
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (!user) {
            // throw new Error(`Username : ${username} not found` ) ;
            return callBack(null, false, { message: 'Incorrect username or password .' })
        }
        //compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {

            // throw new Error(`Invalid password not found`) ;
            return callBack(null, false, { message: 'Invalid password not found .' })
        }
        return callBack(null, user);
    }))
    passport.serializeUser(function (user: any, cb) { //Sau khi login thành công -> Passport sẽ lưu user vào session -> Nhưng không lưu toàn bộ user.
        process.nextTick(function () {
            cb(null, { id: user.id, username: user.username });
        });
    });

    passport.deserializeUser(function (user, cb) { //Mỗi request tiếp theo -> Passport sẽ lấy user từ session và gắn vào:
        process.nextTick(function () {
            return cb(null, user);
        });
    });
}

export default configPassportLocal