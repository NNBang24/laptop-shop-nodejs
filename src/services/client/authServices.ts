import { prisma } from "src/config/client"
import { comparePassword, hashPassword } from "../userServices"
import { ACCOUNT_TYPE } from "src/config/constant"
import { compare } from "bcrypt"

const isEmailExist = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            username: email
        }
    })
    if (user) {
        return true
    }
    return false
}
const registerNewUser = async (
    fullname: string,
    email: string,
    password: string
) => {
    const newPassword = await hashPassword(password);
    const userRole = await prisma.role.findUnique({
        where: {
            name: "USER"
        }
    })
    if (userRole) {
        await prisma.user.create({
            data: {
                username: email,
                password: newPassword,
                fullName: fullname,
                accountType: ACCOUNT_TYPE.SYSTEM,
                roleId: userRole.id
            }
        })
    }
    else {
        throw new Error("User Role khong ton tai ");
    }
}
const getUserWithRoleById = async ( id : string) => {
    const user = await prisma.user.findUnique({
        where : {
            id : +id
        },
        include : {
            role : true
        },
        omit: { // exclude
            password : true
        }
    })
    return user
}
export {
    isEmailExist, registerNewUser  , getUserWithRoleById}