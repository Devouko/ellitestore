import { getMyCart } from "@/lib/Actions/cart.actions";
import CartTable from "./cart-table";



export const metadata ={
    title:' shopping cart',
}
const CartPage = async () => {
    const cart=await getMyCart()

    return ( <><CartTable cart={cart} /></> );
}
 
export default CartPage;