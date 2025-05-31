'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUp } from '@/lib/Actions/user.actions';

const SignUpForm=()=>{
    const [data,action]=useActionState(signUp,{
        message:'',
        success:false
    })
    const searchParams=useSearchParams()
    const callbackUrl=searchParams.get('callbackUrl') || '/'

    const SignUpButton=()=>{
    const {pending}=useFormStatus()
    return(
        <Button disabled={pending} className='w-full
        ' variant='default'>
            {pending? 'Submitting...':'sign up'}

        </Button>
    )
}



return(
    <form action={action}>
    <input type="hidden" name='callbackUrl' value={callbackUrl} />
    <div className="space-y-6">
        <div>
            <Label htmlFor='name'>
                Name
            </Label>
            <Input 
            id='name'
            type='text'
            required
            defaultValue={signUpDefaultValues.name}
            autoComplete='name'
            name='name'/>
        </div>
        <div>
            <Label htmlFor='email'>Email</Label>
            <Input id='email'
            type='email'
            required
            defaultValue={signUpDefaultValues.email}
            autoComplete='email'
            name='email'
            />
        </div>
        <div>
            <Label htmlFor='password'>Password</Label>
            <Input id='password'
            type='password'
            required
            defaultValue={signUpDefaultValues.password}
            autoComplete='new-password'
            name='password'
            />
        </div>
        <div>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input id='confirmPassword'
            type='password'
            required
            defaultValue={signUpDefaultValues.confirmPassword}
            autoComplete='new-password'
            name='confirmPassword'
            />
        </div>
        <div>
            <SignUpButton/>
        </div>
        {data && !data.success && (
            <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link target='_self'
            className='link'
            href={`/sign-in?callbackUrl=${callbackUrl}`}>
                Sign in
            </Link>

        </div>
    </div>
    </form>
)

}
export default SignUpForm