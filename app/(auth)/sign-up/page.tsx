import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card,CardContent,CardDescription,CardTitle,CardHeader } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import {auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./signup-form";

export const metadata:Metadata={
    title:`Sign Up ${APP_NAME}`,
}
const SignUp=async(props:{
    searchParams:Promise<{
        callbackUrl:string
    }>
})=>{
    const searchParams=await props.searchParams
    //Is equivalent to const callbackUrl = searchParams.callbackUrl;
    const {callbackUrl}=searchParams
    const session=await auth()

    if(session){
        redirect(callbackUrl || '/')
    }
    
    return(
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-4">
                <Link href='/' className="flex-center">
                <Image priority={true}
                src='/images/logo.svg'
                width={100}
                height={100}
                alt={`${APP_NAME} Logo`}
                />
                </Link>
                <CardTitle 
                className="text-center">Create Account</CardTitle>
                <CardDescription className="text-center">
                Enter your information below to create your account
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <SignUpForm/>
                </CardContent>
            </Card>
        </div>
    )
}
export default SignUp