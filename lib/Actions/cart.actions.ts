'use server';  

import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { formatError } from '../utils';
import { cartItemSchema, insertCartSchema } from '../validator';
import { prisma } from '@/db';
import { CartItem } from '@/types';
import { convertPlainObject } from '../utils';
import { round2 } from '../utils';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';


const calcPrice=(items: CartItem[]) =>{
  const itemsPrice=round2(
    items.reduce((acc,item)=> acc + Number(item.price)* item.qty,0)
  ),
  shippingPrice=round2(itemsPrice > 100 ? 0 : 10),
  taxPrice=round2(0.15 * itemsPrice),
  totalPrice=round2(itemsPrice + shippingPrice + taxPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2)
  }
}


export async function addItemToCart(data: CartItem) {  
  
  try {
    // Check for session cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart Session not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
    console.log(session, userId);
    
    // Get cart from database
    const cart = await getMyCart();
    
    // Parse and validate submitted item data
    const item = cartItemSchema.parse(data);
    console.log(item);

    // Find product in db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    
    if (!product) throw new Error('Product not found');
    
    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      
      // Create new cart in database
      await prisma.cart.create({
        data: newCart,
      });
      
      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);
      
      return {
        success: true,
        message: 'Item added to cart successfully'
      };
    } else {
      // Check if the product is already in the cart
      const existItem = (cart.items as CartItem[]).find((x) => 
        x.productId === item.productId
      );
      
      if (existItem) {
        // If not enough stock, throw error
        if (product.stock < existItem.qty + 1) {
          throw new Error('Not enough stock');
        }
        
        // Increase quantity of existing item
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // If item is not in the cart, add it
        // Check stock
        if (product.stock < 1) throw new Error("Not enough stock");
        
        // Add item to the cart.items
        cart.items.push(item);
      }
      
      // Save to db
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        }
      });
      
      revalidatePath(`/product/${product.slug}`);
      
      return {
        success: true,
        message: `${product.name} ${existItem ? 'updated in' : 'added to'} the cart successfully`
      };
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
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