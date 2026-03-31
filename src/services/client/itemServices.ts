import { pid } from "process";
import { prisma } from "src/config/client"

const getProducts = async () => {
    const products = await prisma.product.findMany();
    return products
}
const getProductById = async (id: number) => {
    const product = await prisma.product.findUnique({
        where: { id }
    })
    return product
}
const addProductToCart = async (quantity: number, productId: number, user: Express.User) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId: user.id
        }
    })
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })
    if (cart) {
        //update ben cart
        await prisma.cart.update({
            where: {
                id: cart.id
            },
            data: {
                sum: { increment: quantity }, // function tu dong tang cua  prisma

            }
        })

        // update cartDetail 
        // neu chua co ,tao moi. Co roi , cap nha quantity
        // upsert = update + insert
        const currentCartDetail = await prisma.cartDetail.findFirst({
            where: {
                cartId: cart.id,
                productId: productId,
            }
        })
        await prisma.cartDetail.upsert({
            where: {
                id: currentCartDetail?.id ?? 0

            },
            update: {
                quantity: { increment: quantity }
            },
            create: {
                price: product.price,
                quantity: quantity,
                productId: productId,
                cartId: cart.id
            }
        })
    }
    else {
        await prisma.cart.create({
            data: {
                sum: quantity,
                userId: user.id,
                cartDetails: {
                    create: [
                        {
                            price: product.price,
                            quantity: quantity,
                            productId: productId

                        }
                    ]
                }

            }
        })
    }
}

const getProductInCart = async (userId: number) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId
        }
    })
    if (cart) {
        const currentCartDetail = await prisma.cartDetail.findMany({
            where: {
                cartId: cart.id
            },
            include: {
                product: true
            }
        })
        return currentCartDetail
    }
    return [];
}
const deleteProductInCart = async (cartDetailId: number, userId: number, sumCart: number) => {
    //xóa cart-detail
    // await prisma.cartDetail.delete({
    //     where: { id: cartDetailId }
    // })

    const currentCartDetail = await prisma.cartDetail.findUnique({
        where : {
            id : cartDetailId
        }
    }) ;
    const quantity = currentCartDetail.quantity

    if (sumCart === 1) {
        //delete cart
        await prisma.cart.delete({
            where: { userId }
        })
    } else {
        //update cart
        await prisma.cart.update({
            where: { userId },
            data: {
                sum: {
                    decrement: quantity,
                }
            }
        })
    }

}
const updateCartDetailBeforeCheckout = async (data: { id: string, quantity: string }[] ,cartId:string) => {
    let quantity = 0
    for (let i = 0; i < data.length; i++) {
        quantity += +(data[i].quantity)
        await prisma.cartDetail.update({
            where: {
                id: +data[i].id
            },
            data: {
                quantity: +data[i].quantity
            }
        })
    }
    // update cart sum
    await prisma.cart.update({
        where :{
            id : +cartId 
        },
        data : {
            sum : quantity
        }
    })
}
const handlePlaceOrder = async (
    userId: number,
    receiverName: string,
    receiverAddress: string,
    receiverPhone: string,
    totalPrice : number
) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId
        },
        include: {
            cartDetails: true
        }
    })
    if (cart) {
        const dataOrderDetail = cart?.cartDetails?.map( item => ({
            price : item.price ,
            quantity : item.quantity ,
            productId : item.productId
        })
    ) ?? []
        await prisma.order.create({
            data: {
                receiverName,
                receiverAddress,
                receiverPhone,
                paymentMethod: "COD",
                paymentStatus: "PAYMENT_UNPAID",
                status: "PENDING",
                totalPrice: totalPrice,
                userId,
                orderDetails : {
                    create : dataOrderDetail
                }
            }
        })
        // remove cart detail + cart
        await prisma.cartDetail.deleteMany({
            where :{
                cartId : cart.id
            }
        })
        // remove cart
        await prisma.cart.delete({
            where : {id : cart.id}
        })
    }

}

export {
    getProducts,
    getProductById,
    addProductToCart,
    getProductInCart,
    deleteProductInCart,
    updateCartDetailBeforeCheckout,
    handlePlaceOrder
}