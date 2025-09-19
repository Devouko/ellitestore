import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SellerApplicationForm from './seller-application-form';

export const metadata: Metadata = {
  title: 'Apply to be a Seller',
};

const ApplySellerPage = async () => {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Apply to Become a Seller</h1>
        <p className="text-gray-600 mb-8">
          Join our marketplace and start selling your products to thousands of customers.
        </p>
        <SellerApplicationForm />
      </div>
    </div>
  );
};

export default ApplySellerPage;