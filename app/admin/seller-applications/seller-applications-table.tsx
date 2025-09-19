'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { approveSellerApplication, rejectSellerApplication } from '@/lib/actions/seller.actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Check, X, User, Phone, Building } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  email: string;
  businessName: string;
  whatsappNumber: string;
  storeDescription: string;
  createdAt: Date;
}

interface SellerApplicationsTableProps {
  applications: Application[];
}

export default function SellerApplicationsTable({ applications }: SellerApplicationsTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleApprove = async (userId: string) => {
    setLoading(userId);
    try {
      const result = await approveSellerApplication(userId);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Seller application approved successfully',
        });
        window.location.reload();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    setLoading(userId);
    try {
      const result = await rejectSellerApplication(userId);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Seller application rejected',
        });
        window.location.reload();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500">No pending seller applications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => (
        <Card key={application.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {application.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{application.email}</p>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Business Name</p>
                    <p className="text-sm text-gray-600">{application.businessName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-gray-600">{application.whatsappNumber}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-1">Store Description</p>
                <p className="text-sm text-gray-600">{application.storeDescription}</p>
              </div>
              
              <div className="text-xs text-gray-500">
                Applied on: {new Date(application.createdAt).toLocaleDateString()}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleApprove(application.id)}
                  disabled={loading === application.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {loading === application.id ? 'Approving...' : 'Approve'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(application.id)}
                  disabled={loading === application.id}
                >
                  <X className="h-4 w-4 mr-1" />
                  {loading === application.id ? 'Rejecting...' : 'Reject'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}