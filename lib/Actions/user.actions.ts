'use server'

import { signInFormSchema,signUpFormSchema } from "../validator"
import  {signIn,signOut} from '@/auth'
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { hashSync } from "bcrypt-ts-edge"
import { prisma } from '@/db'
import { formatError } from '../utils';
export async function signInWithCredentials(prevState:unknown
 ,formData:FormData) {
    try{
        const user=signInFormSchema.parse({
            email:formData.get('email'),
            password:formData.get('password')
        })
        await signIn('credentials',user)
        return {success:true,message:'Sign in successful'}

    }catch(error){
        if(isRedirectError(error)){
            throw error
        }
        return {success:false,message: formatError(error)}

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



export async function signOutUser() {
    try{
        await signOut()
        return {success:true,message:'Sign out successful'}
    }catch(error){
        return {success:false,message:'Sign out failed'}
    }
}