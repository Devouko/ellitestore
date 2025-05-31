'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultvalues } from "@/lib/constants";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/Actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const CredentialsSignInForm = () => {
    const [data,action]=useActionState(signInWithCredentials,{
        success:false,
        message:''
    })

    const searchParams=useSearchParams()
    const callbackUrl=searchParams.get('callbackUrl') || '/'

    const SignInButton=()=>{
        const {pending}=useFormStatus()
        return(
            <Button disabled={pending} className="w-full" variant='default'>
                {pending ? 'Signing in...' : 'Sign In'}
            </Button>
        )
    }
     
    return (
        <form action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="space-y-6">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id='email'
                        type='email'
                        required
                        autoComplete="email"
                        placeholder="Enter your email"
                        defaultValue={signInDefaultvalues.email}
                        name="email"
                    />
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id='password'
                        type='password'
                        required
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        defaultValue={signInDefaultvalues.password}
                        name="password"
                    />
                </div>
                <div>
                    <SignInButton/>
                </div>

                {data && !data.success && (
                    <div className="text-center text-destructive">
                        {data.message}
                    </div>
                )}
                
                <div className="text-sm text-center text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href='/sign-up' target="_self" className="link">
                        Sign Up
                    </Link>
                </div>
            </div>
        </form>
    );
}
 
export default CredentialsSignInForm;