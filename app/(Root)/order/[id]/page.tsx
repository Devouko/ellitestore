import OrderDetailsTable from "./order-details-table";
import { notFound } from 'next/navigation'
import { getOrderById } from "@/lib/Actions/order.actions";
import type { shippingAddress } from "@/types"; // Adjust the import path as needed

export const metadata = {
    title: 'order Details'
}

type PageProps = {
    params: {
        id: string
    }
}

const OrderDetailsPage = async ({ params }: PageProps) => {
    const { id } = params;
    const order = await getOrderById(id);
    if (!order) notFound();

    return (
        <OrderDetailsTable order={{
            ...order,
            shippingAddress: order.shippingAddress as shippingAddress
        }}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'} />
    );
}

export default OrderDetailsPage;