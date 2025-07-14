import { Metadata } from "next"
import {auth} from "@/auth"
import { getUserById } from "@/lib/Actions/user.actions"
import PaymentMethodForm from "./Payment-method-form"
export const metadata:Metadata={
    title:'Payment Method'
}

const PaymentMethodPage = async() => {
    const session=await auth()
    const userId=session?.user?.id
        if(!userId){
            throw new Error('user Id not found')
        }
   const user=await getUserById(userId)
    return ( <>
    <PaymentMethodForm preferredPaymentMethod={user.paymentMethod}/>
    </> );
}
 
export default PaymentMethodPage;