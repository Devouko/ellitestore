'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { registerSeller } from '@/lib/Actions/seller.actions';

const sellerSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  whatsappNumber: z.string().min(10, 'Valid WhatsApp number required'),
  storeDescription: z.string().min(10, 'Store description must be at least 10 characters'),
  storeLogo: z.string().optional(),
  storeBanner: z.string().optional(),
});

type SellerFormData = z.infer<typeof sellerSchema>;

export default function SellerRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SellerFormData>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      businessName: '',
      whatsappNumber: '',
      storeDescription: '',
      storeLogo: '',
      storeBanner: '',
    },
  });

  const onSubmit = async (data: SellerFormData) => {
    setIsSubmitting(true);
    try {
      const result = await registerSeller(data);
      if (result.success) {
        toast({
          title: 'Application Submitted',
          description: 'Your seller application has been submitted for review.',
        });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business/Store Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whatsappNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Number</FormLabel>
              <FormControl>
                <Input placeholder="+254712345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your store and products..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeLogo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Logo URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeBanner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Banner URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/banner.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Form>
  );
}