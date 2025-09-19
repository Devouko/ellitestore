import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSellerProducts } from '@/lib/Actions/seller.actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProductList from './product-list';

export const metadata: Metadata = {
  title: 'My Products',
};

export default async function SellerProductsPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'seller') {
    redirect('/seller/sign-in');
  }

  const products = await getSellerProducts(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Button asChild>
          <Link href="/seller/products/create">Add Product</Link>
        </Button>
      </div>
      
      <ProductList products={products} />
    </div>
  );
}