'use server';


import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { formatError } from '../utils';
import { cartItemSchema } from '../validator';
import  {prisma}  from '@/db/prisma';
import { CartItem } from '@/types';
import { convertPlainObject } from '../utils';

export async function addItemToCart(data: CartItem) {  // Fixed syntax - removed '=>'
    try {
        // Check for session cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Cart Session not found');

        // Get session and user Id
        const session = await auth();
        const userId = session?.user?.id as string | undefined;

        console.log({
            'session Cart Id': sessionCartId,
            'User Id': userId,
        });

        // Find product in database
        const product = await prisma.product.findFirst({
            where: { id: data.productId },
        });
        if (!product) throw new Error('Product not found');

        // Find or create cart
        const cart = await prisma.cart.upsert({
            where: {
                id: userId ? { userId } : { sessionCartId }
            },
            create: {
                items: [data],
                sessionCartId,
                ...(userId && { userId }),
                itemsPrice: product.price,
                shippingPrice: 0, // Set appropriate default
                taxPrice: 0,     // Set appropriate default
                totalPrice: product.price
            },
            update: {
                items: {
                    push: data
                },
                // Update prices accordingly
            }
        });

        return {
            success: true,
            message: 'Item added to cart',
            cart: convertPlainObject(cart)
        };
    } catch (error) {
        return { 
            success: false, 
            message: formatError(error) 
        };
    }
}

export async function getMyCart() {
    try {
        // Check for session cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) return null;

        // Get session and user Id
        const session = await auth();
        const userId = session?.user.id as string | undefined;

        // Get user cart from db
        const cart = await prisma.cart.findFirst({
            where: userId ? { userId } : { sessionCartId },
        });
        
        if (!cart) return null;

        // Convert Decimal values to strings
        return convertPlainObject({
            ...cart,
            items: cart.items as CartItem[],
            itemsPrice: cart.itemsPrice.toString(),
            totalPrice: cart.totalPrice.toString(),
            shippingPrice: cart.shippingPrice.toString(),
            taxPrice: cart.taxPrice.toString(),
        });
    } catch (error) {
        console.error('Error getting cart:', error);
        return null;
    }
}