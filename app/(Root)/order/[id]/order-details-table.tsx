'use client'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { approvePaypalOrder,createPaypalOrder } from '@/lib/Actions/order.actions';




const OrderDetailsTable = ({order,paypalClientId}:{order:Order; paypalClientId:string}) => {

const {
  shippingAddress,
  orderItems,
  itemPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
  paymentMethod,
  isPaid,
  paidAt,
  isDelivered,
  deliveredAt,
} = order  
const {toast} =useToast()

function PrintLoadingState(){
    const [{isPending,isRejected}]=usePayPalScriptReducer()
    let status =''
    if(isPending){
        status='Loading paypal...'

}else if(isRejected){
        status='Error loading paypal'
    }
    return status
}
const handleCreatePayPalOrder=async()=>{
    const res=await createPaypalOrder(order.id)
    if(!res.success){
        toast({
            description:res.message,
            variant:'destructive'
        })
        return
    }
    return res.data
}

const handleApprovePayPalOrder=async (data:{orderID:string})=>{
    const res=await approvePaypalOrder(order.id,data)
    toast({
        description:res.message,
        variant:res.success?'default':'destructive',
    })
}
    return ( <>
    <h1 className="py-4 text-2xl">Order {formatId(order.id)}</h1>
    <div className="grid md:grid-cols-4 md:gap-5"
    
    >
        <div className="overflow-x-auto md:col-span-2 space-y-4">
            <Card>
                <CardContent className='p-4 gap-4'>
                <h2 className="text-xl pb-">Payment Method</h2>
                <p>{paymentMethod}</p>
                {isPaid?(
                    <Badge variant='secondary'>
                        Paid At {formatDateTime(paidAt!).dateTime}
                    </Badge>
                ):(
                    <Badge variant='destructive'>
                        Not paid
                    </Badge>
                )}

                </CardContent>
            </Card>
            <Card>
                <CardContent className='p-4 gap-4'>
                    <h2 className="text-xl pb-4">
                       Shipping Address
                    </h2>
                    <p> {shippingAddress.fullName} </p>
                    <p className='mb-4'>{shippingAddress.streetAddress},
                        {shippingAddress.city},
                        {shippingAddress.postalCode},{' '}
                        {shippingAddress.country},{' '}
                    </p>
                    {isDelivered ?(
                        <Badge variant='secondary'>
                            Delivered At {formatDateTime(deliveredAt!).dateTime}
                        </Badge>
                    ):(
                        <Badge variant ='destructive'>Not delivered</Badge>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className='p-4 gap-4'>
                    <h2 className="text-xl pb-4">Order Items</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderItems.map((item)=>(
                                <TableRow key={item.slug}>
                                    <TableCell>
                                        <Link
                                        href={`/product/${item.slug}`}
                                        className='flex items-center'>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={50}
                                                height={50}
                                                className='rounded-md mr-3'
                                            />
                                            <span>{item.name}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell>{item.qty}</TableCell>
                                    <TableCell>{formatCurrency(item.price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>


            </Card>

        </div>
        <div>
         <Card>
            <CardContent className='mb-4 gap-4'>
                <h2 className="text-xl pb-4">Order summary</h2>
               <div className="flex justify-between">
                <div >Items</div>
                <div>{formatCurrency(itemPrice)}</div>
                
                </div>
                <div className="flex justify-between">
                            <div>Tax </div> 
                            <div>{formatCurrency(taxPrice)}</div>
                </div>
                <div className="flex justify-between">
                    <div>Shipping</div>
                    <div>{formatCurrency(shippingPrice)}</div>
                </div>
                <div className='flex justify-between'>
                    <div>Total</div>
                    <div>{formatCurrency(totalPrice)}</div>
                </div>
                 {
                    /*paypal payment*/
                 }   
                 {
                 !isPaid && paymentMethod==='Paypal' &&(
                    <div>
                        <PayPalScriptProvider options={{
                            clientId:paypalClientId
                        }}>
                            <PrintLoadingState/>
                            <PayPalButtons
                            createOrder={handleCreatePayPalOrder}
                            onApprove={handleApprovePayPalOrder} />
                            </PayPalScriptProvider>
                    </div>
                 )        
                   }         
            </CardContent>
            </Card>                   

        </div>
    </div>
    </> );
}
export default OrderDetailsTable ;