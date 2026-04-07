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
    // Lấy product
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        throw new Error("Product not found"); 
    }

  
    const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { cartDetails: true } 
    });

    if (cart) {
        
        await prisma.cart.update({
            where: { id: cart.id },
            data: { sum: { increment: quantity } },
        });

      
        const currentCartDetail = cart.cartDetails.find(cd => cd.productId === productId);

        if (currentCartDetail) {
         
            await prisma.cartDetail.update({
                where: { id: currentCartDetail.id },
                data: { quantity: { increment: quantity } },
            });
        } else {
           
            await prisma.cartDetail.create({
                data: {
                    price: product.price,
                    quantity: quantity,
                    productId: productId,
                    cartId: cart.id,
                },
            });
        }
    } else {
      
        await prisma.cart.create({
            data: {
                sum: quantity,
                userId: user.id,
                cartDetails: {
                    create: [{
                        price: product.price,
                        quantity: quantity,
                        productId: productId,
                    }],
                },
            },
        });
    }
};

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
const deleteProductInCart = async (
    cartDetailId: number,
    userId: number,
    sumCart: number
) => {
    // xóa cartDetail
    await prisma.cartDetail.delete({ where: { id: cartDetailId } });

    if (sumCart === 1) {
        // xóa cart nếu sumCart = 1
        await prisma.cart.delete({ where: { userId } });
    } else {
        // giảm sumCart
        await prisma.cart.update({
            where: { userId },
            data: { sum: { decrement: 1 } },
        });
    }
};
const updateCartDetailBeforeCheckout = async (data: { id: string, quantity: string }[]) => {
    for (let i = 0; i < data.length; i++) {
        await prisma.cartDetail.update({
            where: {
                id: +data[i].id
            },
            data: {
                quantity: +data[i].quantity
            }
        })
    }
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