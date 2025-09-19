'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { approveSellerApplication, rejectSellerApplication } from '@/lib/Actions/seller.actions';

interface Seller {
  id: string;
  name: string;
  email: string;
  businessName: string;
  whatsappNumber: string;
  storeDescription: string;
  sellerStatus?: string;
  createdAt: Date;
}

export default function SellerApprovalList({ sellers }: { sellers: Seller[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleApprove = async (sellerId: string) => {
    setLoading(sellerId);
    try {
      const result = await approveSellerApplication(sellerId);
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        window.location.reload();
      }
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (sellerId: string) => {
    setLoading(sellerId);
    try {
      const result = await rejectSellerApplication(sellerId);
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        window.location.reload();
      }
    } finally {
      setLoading(null);
    }
  };

  if (sellers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No pending seller applications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sellers.map((seller) => (
        <Card key={seller.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{seller.businessName}</CardTitle>
                <p className="text-sm text-gray-600">{seller.name} - {seller.email}</p>
              </div>
              <Badge variant="outline">{seller.sellerStatus || 'pending'}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p><strong>WhatsApp:</strong> {seller.whatsappNumber}</p>
              <p><strong>Description:</strong> {seller.storeDescription}</p>
              <p><strong>Applied:</strong> {new Date(seller.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleApprove(seller.id)}
                disabled={loading === seller.id}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading === seller.id ? 'Processing...' : 'Approve'}
              </Button>
              <Button
                onClick={() => handleReject(seller.id)}
                disabled={loading === seller.id}
                variant="destructive"
              >
                {loading === seller.id ? 'Processing...' : 'Reject'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}