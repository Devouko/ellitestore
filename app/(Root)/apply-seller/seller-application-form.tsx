'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { applyToBeSeller } from '@/lib/actions/seller.actions';
import { useState } from 'react';

export default function SellerApplicationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await applyToBeSeller(formData);
      if (result.success) {
        toast({
          title: 'Application Submitted',
          description: 'Your seller application has been submitted for review.',
        });
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
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              name="businessName"
              required
              placeholder="Enter your business name"
            />
          </div>
          
          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              required
              placeholder="+254710727775"
            />
          </div>
          
          <div>
            <Label htmlFor="storeDescription">Store Description *</Label>
            <Textarea
              id="storeDescription"
              name="storeDescription"
              required
              placeholder="Describe your store and products"
              rows={4}
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}