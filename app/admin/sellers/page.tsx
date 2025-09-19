import { Metadata } from 'next';
import { getSellerApplications } from '@/lib/Actions/seller.actions';
import SellerApprovalList from './seller-approval-list';

export const metadata: Metadata = {
  title: 'Seller Management - Admin',
};

export default async function AdminSellersPage() {
  const pendingSellers = await getSellerApplications();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Seller Management</h1>
      <SellerApprovalList sellers={pendingSellers} />
    </div>
  );
}