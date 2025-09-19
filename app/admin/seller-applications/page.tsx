import { Metadata } from 'next';
import { getSellerApplications } from '@/lib/actions/seller.actions';
import SellerApplicationsTable from './seller-applications-table';

export const metadata: Metadata = {
  title: 'Seller Applications',
};

export default async function SellerApplicationsPage() {
  const applications = await getSellerApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seller Applications</h1>
        <p className="text-gray-600">Review and approve seller applications</p>
      </div>
      
      <SellerApplicationsTable applications={applications} />
    </div>
  );
}