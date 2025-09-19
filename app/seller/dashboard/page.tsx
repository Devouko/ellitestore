import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSellerMetrics, getSellerSalesData } from '@/lib/Actions/seller.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Charts from './charts';

export const metadata: Metadata = {
  title: 'Seller Dashboard',
};

export default async function SellerDashboardPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'seller') {
    redirect('/seller/sign-in');
  }

  const metrics = await getSellerMetrics(session.user.id);
  const salesData = await getSellerSalesData(session.user.id);
  
  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load seller metrics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.totalProducts}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(metrics.totalSales)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.totalOrders}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-green-600">
              {session.user.sellerStatus || 'Active'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/seller/products/create">Add New Product</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/seller/products">Manage Products</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts data={{ salesData }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}