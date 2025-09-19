import { Metadata } from 'next';
import SellerRegistrationForm from './seller-registration-form';

export const metadata: Metadata = {
  title: 'Become a Seller - ElliteStore',
  description: 'Join ElliteStore as a seller and start selling your products',
};

export default function BecomeSellerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Become a Seller</h1>
        <p className="text-gray-600">
          Join thousands of sellers on ElliteStore and start selling your products today
        </p>
      </div>
      <SellerRegistrationForm />
    </div>
  );
}