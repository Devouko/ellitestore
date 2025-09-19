import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/admin/product-form';

export const metadata: Metadata = {
  title: 'Add Product - Seller',
};

export default async function CreateProductPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'seller') {
    redirect('/seller/sign-in');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Product</h1>
      <ProductForm type="Create" />
    </div>
  );
}