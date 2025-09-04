'use server'

import { isRedirectError } from 'next/dist/client/components/redirect';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '@/lib/validator'
import { prisma } from '@/db/prisma';

import {convertPlainObject} from '../utils'
import {revalidatePath} from 'next/cache'
import {paypal} from '../paypal'
import {CartItem,PaymentResult} from '@/types'
import { PAGE_SIZE } from '../constants';
const createOrder = async() => {
    try {
    const session=auth()
     const cart=await getMyCart()
      const userId=session?.user?.id
     const user =await getUserById(userId)
    

    if(!session) throw new Error('User  is not authenticated')
   
    if(!userId) throw new Error('User not found')
   
   
    if(!cart || cart.items.length===0){
        return{
            success:false,
            message:'Your cart is empty',
            redirectTo:'/cart',
        }
    }
    if(!user.address){
        return {
        success:false,
        message:'No shipping address',
        redirectTo:'/shipping-address',
        }
    }
    if(!user.paymentMethod){
        return {
            success:false,
            message:'No Payment method',
            redirectTo:'/payment-method',
        }
    }
        const order=insertOrderSchema.parse({
            userId:user.id,
            itemPrice:cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice:cart.taxPrice,
            totalPrice:cart.totalPrice,
            paymentMethod:user.paymentMethod,
            shippingAddress:user.address
        })
    const insertedOrderId=await prisma.$transaction(async (tx)=>{
        const insertOrder=await tx.order.create({
            data:order
        })
        // Create order items from the cart items
        for(const item of cart.items as CartItem[]){
            await tx.orderItem.create({
                data:{
                    ...item,
                    price:item.price,
                    orderId:insertOrder.id
                }
            })
        }
        //clear cart

        await tx.cart.update({
            where:{
                id:cart.id
            },
            data:{
                items:[],
                totalPrice:0,
                itemsPrice:0,
                shippingPrice:0,
                taxPrice:0
            }
        })
        return insertOrder.id
    })
    if(!insertedOrderId) throw new Error('Order not created')
        return {
    success:true,
    message:'order created succcessfully',
    redirectTo:`/order/${insertedOrderId}`
        }
    }
}
        } catch (error) {
        if(isRedirectError(error)){
            throw error
        }
        return {success:false,message:formatError(error)}
    }
}
   export  async function getOrderById(orderId:string){
const data=await prisma.order.findFirst({
    where:{
        id:orderId,
    },
    include:{
        orderitems:true,
        user:{select:{name:true,email:true}},
      },
})
return convertPlainObject(data)
    }

    export async function getMyOrders({
        limit=PAGE_SIZE,
        page,
    }:{
        limit?:number;
        page:number;
    
    }){
        const session = await auth();
        if (!session || !session.user) throw new Error('User is not Authenticated');
        const data = await prisma.order.findMany({
            where: {
                userId: session.user.id!
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: (page - 1) * limit,
        });
        const dataCount = await prisma.order.count({
            where: { userId: session.user.id! }
        });
        return {
            data,
            totalPages: Math.ceil(dataCount / limit),
        };
    }
    export async function createPaypalOrder(orderId:string){
        try {
            //get oders from db
        const order=await prisma.order.findFirst({
            where:{
                id:orderId,
            }
        })
        if(order){
            //create paypal order

            const payPalOrder=await paypal.createOrder(
                Number(order.totalPrice))
   // Update the order with the paypal order id
             await prisma.order.update({
                where:{
                    id:orderId,
                },
                data:
                {
                    paymentResult:{
                        id:payPalOrder.id,
                        email_address:'',
                        status:"",
                        pricePaid:'0',
                    }
                }
             })   
             // Return the paypal order id
             return {
                success:true,
                message:'Paypal order created successfully',
                data:payPalOrder.id
             }
            }else{
              throw new Error('Order not found')  
            }



        } catch (error) {
            return {
                success:false,
                message:formatError(error)
            }
            
        }
    }
    //approve paypal order
    export async function approvePaypalOrder(
        orderId:string,
        data:{orderID:string}

    ) {
        try {
            //find the order in db
            const order=await prisma.order.findFirst({
                where:{
                    id:orderId,
                }
            })
            if(!order){
                throw new Error('Order not found')
            }


            //Check if the order is already paid
            const captureData=await paypal.capturePayment(data.orderID)
            if(!captureData || captureData.id !==(order.paymentResult as PaymentResult)?.id || captureData.status !=='COMPLETED') {

                throw new Error('Error in paypal payment')
            }

            async function updateOrderToPaid(
                {
                    orderId,
                    paymentResult,
                }:{
                    orderId:string,
                    paymentResult?:PaymentResult

                }
            )
            {
                // Find the order in the database and include the order items
                const order= await prisma.order.findFirst ({
                where: {
                   id:orderId,
                }, 
    
                     include :  {
                        orderitems:true,
                     }
                    }
                )
                if(!order) throw new Error("Order not found")
                    if(order.isPaid) throw new Error("order is already paid")

 // Transaction to update the order and update the product quantities
 await prisma.$transaction(async (tx)=>{
    //update all item quantities in the db
    for(const item of order.orderitems){
        await tx.product.update({
            where:{id:item.productId},
            data:{stock:{increment:-item.qty}},
        })
 

}

//set the order to paid
await tx.order.update({
    where:{id:orderId},
    data:{
        isPaid:true,
        paidAt:new Date(),
        paymentResult,
    }
})
 })
    // Get the updated order after the transaction

    const updatedOrder=await prisma.order.findFirst({
        where:{
            id:  orderId,
        },
        include:{
            orderitems:true,
            user:{select:{name:true,email:true}},
        },
        })
        if(!updatedOrder) throw new Error("Order not found")
    }

            //update the order to paid
            await updateOrderToPaid({
                orderId,
                paymentResult:{
                    id:captureData.id,
                    status: captureData.status,
                    email_address: captureData.payer.email_address,
                    pricePaid: captureData.purchase_units[0].amount.value
                }
            })


            revalidatePath(`/order/${orderId}`)

            return {
                success:true,
                message:'Order paid successfully by paypal'
            }
        } catch (err) {
            return {
                success:false,
                message:formatError(err)
            }
        }
    }


