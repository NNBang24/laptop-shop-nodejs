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
                id : currentCartDetail?.id?? 0

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
export {
    getProducts,
    getProductById,
    addProductToCart
}