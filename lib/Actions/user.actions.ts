'use server'

import { shippingAddressSchema, signInFormSchema,signUpFormSchema, paymentMethodSchema } from "../validator"
import  {auth, signIn,signOut} from '@/auth'
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { hashSync } from "bcrypt-ts-edge"
import { prisma } from '@/db'
import { formatError } from '../utils';

import { z } from 'zod';

export async function signInWithCredentials(prevState:unknown
 ,formData:FormData) {
    try{
        const user=signInFormSchema.parse({
            email:formData.get('email'),
            password:formData.get('password')
        })
        
        const callbackUrl = formData.get('callbackUrl') as string || '/';
        await signIn('credentials', {
            ...user,
            redirectTo: callbackUrl
        })
        
        return {success:true,message:'Sign in successful'}

    }catch(error){
        if(isRedirectError(error)){
            throw error
        }
        
        // Handle specific error types
        if (error.name === 'ZodError') {
            return {
                success: false,
                message: formatError(error)
            }
        }
        
        // Handle authentication errors
        if (error.type === 'CredentialsSignin' || error.message?.includes('CredentialsSignin')) {
            return {
                success: false,
                message: 'Invalid email or password'
            }
        }
        
        return {
            success: false,
            message: 'Invalid email or password'
        }
    }
}
export async function signUp(prevState:unknown,formData:FormData) {
    try{
        const user=signUpFormSchema.parse({
            name:formData.get('name'),
            email:formData.get('email'),
            password:formData.get('password'),
            confirmPassword:formData.get('confirmPassword'),
        })
        
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
        });
        
        if (existingUser) {
            return {
                success: false,
                message: "Email already in use. Please use a different email."
            };
        }

        const plainPassword=user.password
        user.password=hashSync(user.password,10)

        await prisma.user.create({
            data:{
                name:user.name,
                email:user.email,
                  password:user.password,
              },
        })

        await signIn('credentials',{
            email:user.email,
            password:plainPassword,
        })
        return {
            success: true, 
            message: 'User created successfully'
        }
    }catch(error){
        if(isRedirectError(error)){
            throw error
        }
        return {
            success:false,
            message: formatError(error)
        }
    }
}
export async function updateUserProfile(user:{
    name: string
    email:string
}) { try {
    const session = await auth()
    
    const currentUser = await prisma.user.findFirst({
        where: {
            id:session?.user.id,
        },
    })
    if (!currentUser) throw new Error('User not Found')
    await prisma.user.update({
        where: {
            id: currentUser.id,
        },
        data: {
        name:user.name,
    }
    })
    return {
    success:true,
    message:'user update successfully'
}


} catch (error) {
    return {
        success:false,
        message:formatError(error)
    }
    
}

}

export async function updateUserAddress(data: shippingAddress){
try{
    const session =await  auth()
    const currentUser=await prisma.user.findFirst({
        where : {id:session?.user?.id!},
    })
    if(!currentUser) throw new Error('User not found')

        const address=shippingAddressSchema.parse(data)

        await prisma.user.update({
            where:{id:currentUser.id},
            data:{address}
        })
        return {
            success: true,
            message:'User Address updated successfully'
        }


}catch(error){
    return {
        success:false,
        message:formatError(error)
    }
    
}


}
export async function updateuserPaymentMethod(
    data:z.infer<typeof paymentMethodSchema>
){
    try {
        const session = await auth()
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id! },
        })
        if(!currentUser) throw new Error('User not found')
            const paymentMethod=paymentMethodSchema.parse(data)
         await prisma.user.update({
            where:{id:currentUser.id},
            data:{paymentMethod:paymentMethod.type}
         })
         return{
            success:true,
            message:'User payment method updated successfully'
         }
    } catch (error) {
        return {
            success:false,
            message:formatError(error)
    }
}
}



export async function signOutUser() {
    try{
        await signOut()
        return {success:true,message:'Sign out successful'}
    }catch(error){
        return {success:false,message:'Sign out failed'}
    }
}

    export async function getUserById(userId:string){
        try {
            const user=await prisma.user.findFirst({
                where:{id:userId}
            })
            if(!user) throw new Error('user not found')
            return user

            
        } catch (error) {
            throw error
        }
    }




