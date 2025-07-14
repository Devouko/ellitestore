'use client'

import { useForm, ControllerRenderProps, SubmitHandler } from 'react-hook-form';
import { shippingAddress } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema } from '@/lib/validator';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { startTransition, useTransition } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { updateUserAddress } from '@/lib/Actions/user.actions';

import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'
import CheckoutSteps from '@/components/shared/checkout-steps';
const ShippingAddressForm = ({ address }: { address: shippingAddress | null }) => {
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });
  const [isPending] = useTransition();
  const router=useRouter()
  


    const onSubmit:SubmitHandler<z.infer<typeof shippingAddressSchema>>=
    async(
      values
    ) => {
      startTransition (async()=>{
        const res=await updateUserAddress(values)
        if(!res.success){
          toast({
            variant:'destructive',
            description:res.message,
          })
          return
        }
        router.push('/payment-method')
      } )
    }




  return (
    <>
    <CheckoutSteps current={1} />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter the address you want to ship to
        </p>
        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col gap-5 md:flex-row">
                <FormField 
                control={form.control}
                name='fullName'
                render={({field,

                }:{
                    field : ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    'fullName'>
                })=>(
                    <FormItem className="w-full">
                    <FormLabel> Full Name</FormLabel>
                    <FormControl>
                    <Input placeholder='Enter full Name' {...field}/>
                    
                    
                    </FormControl>
                    <FormMessage/>
                    </FormItem>

                )}
               />
            </div>

               <div>
               <FormField 
               control={form.control}
               name='streetAddress'
               render={(
                {
                    field,
                }:{field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>,
                    'streetAddress'>
                
               })=>(
                <FormItem className='w-full'>
                <FormLabel>Address</FormLabel>
                <FormControl>
                <Input placeholder='Enter Street address' {...field}/>
                </FormControl>
                <FormMessage/>
                </FormItem>
               )}
               />
               

            </div>
               <div className='flex flex-col gap-5'>
               <FormField 
               control={form.control}
               name='country'
               render={(
                {
                    field,
                }:{field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>,
                    'country'>
                
               })=>(
                <FormItem className='w-full'>
                <FormLabel>Address</FormLabel>
                <FormControl>
                <Input placeholder='Enter count' {...field}/>
                </FormControl>
                <FormMessage/>
                </FormItem>
               )}
               />
               <FormField 
               control={form.control}
               name='postalCode'
               render={(
                {
                    field,
                }:{field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>,
                    'postalCode'>
                
               })=>(
                <FormItem className='w-full'>
                <FormLabel>Address</FormLabel>
                <FormControl>
                <Input placeholder='Enter postalCode' {...field}/>
                </FormControl>
                <FormMessage/>
                </FormItem>
               )}
               />
               <FormField 
               control={form.control}
               name='city'
               render={(
                {
                    field,
                }:{field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>,
                    'city'>
                
               })=>(
                <FormItem className='w-full'>
                <FormLabel>Address</FormLabel>
                <FormControl>
                <Input placeholder='Enter City' {...field}/>
                </FormControl>
                <FormMessage/>
                </FormItem>
               )}
               /></div>
               <div className="flex gap-2">
               <Button type='submit' disabled={isPending}>
               {isPending ? (
                <Loader className='w-4 h-4 animate-spin'/>):(
                    <ArrowRight className='w-4 h-4'/>
                )}{' '}
                continue
               </Button>
               </div>

            </form>
        </Form>
    </div>
    
    
    </>
  );
};
  
export default ShippingAddressForm;
