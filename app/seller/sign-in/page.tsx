import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import CredentialsSignInForm from '@/components/shared/credentials-signin-form';

export const metadata: Metadata = {
  title: 'Seller Sign In',
};

export default async function SellerSignInPage() {
  const session = await auth();
  
  if (session) {
    if (session.user.role === 'seller') {
      redirect('/seller/dashboard');
    } else if (session.user.role === 'admin') {
      redirect('/admin/overview');
    } else {
      redirect('/');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Seller Sign In</h1>
        <p className="text-gray-600">Access your seller dashboard</p>
      </div>
      <CredentialsSignInForm />
    </div>
  );
}