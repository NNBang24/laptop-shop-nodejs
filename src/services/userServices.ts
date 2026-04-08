


import { prisma } from "../config/client"
import { postUpdateUser } from "src/controllers/userController";
import { ACCOUNT_TYPE, TOTAL_ITEMS_PER_PAGE } from "src/config/constant";
import bcrypt from "bcrypt";
// const bcrypt = require('bcrypt') ;
const saltRounds = 10;

const hashPassword = async (passwordPlainText: string) => {
    return await bcrypt.hash(passwordPlainText, saltRounds)
}
const comparePassword = async (passwordPlainText: string ,hashPassword : string) => {
    return await bcrypt.compare(passwordPlainText ,hashPassword)
}
const handleCreateUser = async (fullName: string, email: string, address: string, phone: string, avatar: string, role: string) => {
    //insert in to database 
    const defaultPassword = await hashPassword("123456")
    const newUser = await prisma.user.create({
        data: {

            fullName: fullName,
            username: email,
            address: address,
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            avatar: avatar,
            phone: phone,
            roleId: +role // "2" = 2

        }
    })
    return newUser
};

const handleDeleteUser = async (id: string) => {
    const deleteUser = await prisma.user.delete({
        where: {
            id: +id
        }
    })
    return deleteUser;
}
const getUserById = async (id: string) => {
    const getUserById = await prisma.user.findUnique({
        where: { id: +id }
    })
    return getUserById;
}
// id, fullName, phone, role, address , avatar
const handleUpdateUserById = async (
    id: string,
    fullName: string,
    phone: string,
    role : string ,
    address: string,
    avatar: string
) => {
    const postUpdateUser = await prisma.user.update({
        where: { id: +id },
        data: {
            fullName: fullName,
            phone: phone,
            roleId: +role,
            address: address,
            ...(avatar !== undefined && {avatar : avatar})
           
        }
    });
    return postUpdateUser
}
const getALlUsers = async (page :number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE
    const skip = (page -1) * pageSize // offset // phan trang
    const getALlUsers = await prisma.user.findMany(
        {
            skip : skip   ,
            take : pageSize
            
        }
    );
    return getALlUsers
}
const countTotalUserPages = async() => {
    const totalItems = await prisma.user.count() ;
    const pageSize = TOTAL_ITEMS_PER_PAGE
    const totalPages = Math.ceil(totalItems / pageSize) ;
    return totalPages
}
const getALlRoles = async () => {
    const role = await prisma.role.findMany();
    return role;


}

export { handleCreateUser, getALlUsers, handleDeleteUser, getUserById, handleUpdateUserById, getALlRoles, hashPassword, comparePassword , countTotalUserPages }