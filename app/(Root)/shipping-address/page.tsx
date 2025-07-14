import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {getUserById} from "@/lib/Actions/user.actions";
import { Metadata } from "next";
import { shippingAddress } from "@/types";
import { getMyCart } from "@/lib/Actions/cart.actions";
import ShippingAddressForm from "./shipping-address-form";

export const metadata: Metadata={
    title:"Shipping Address",
}


const ShippingAddressPage = async() => {
    const cart=await getMyCart()
    if(!cart || cart.items.length===0)
        redirect('/cart')
    const session=await auth()
    const userId=session?.user?.id
    if(!userId){
        throw new Error('user ID not found')
    }
    const user=await getUserById(userId)

    return ( <>
    <ShippingAddressForm address={user.address as shippingAddress} /></> );
}
 
export default ShippingAddressPage;

