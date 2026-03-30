import { prisma } from "src/config/client"

const getOrderAdmin =async () => {
    return await prisma.order.findMany({
        include :{user : true}
    })
} 

const getOrderDetailAdmin = async (orderId : number) =>{
    return await prisma.orderDetail.findMany({
        where : {
            orderId
        } ,
        include :{
            product : true
        }
    })
}
const getOrderHistory = async (userId : number) => {
    return await prisma.order.findMany({
        where : {
            userId
        },
        include : {
            orderDetails :{
                include : {
                    product :true
                }
            }
        }
    })
}
export {
    getOrderAdmin ,
    getOrderDetailAdmin ,
    getOrderHistory
}
