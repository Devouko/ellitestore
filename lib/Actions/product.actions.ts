'use server';


import { prisma } from '@/db'
import {convertPlainObject} from '../utils'
import { LATEST_PRODUCT_LIMIT } from "../constants";

//get latest products
export async function getLatestProducts(){
   
    const data=await prisma.product.findMany({
        take:LATEST_PRODUCT_LIMIT,
        orderBy:{
            createdAt:'desc'
        }
    })
  
    return convertPlainObject(data) 

}
    //get single products
    export async function getProductBySlug(slug:string){
     return await prisma.product.findFirst({
        where:{slug:slug
            }
     })
    }
