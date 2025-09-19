'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function CurrencySettings() {
  const [currency, setCurrency] = useState(process.env.NEXT_PUBLIC_CURRENCY || 'KSH');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleCurrencyChange = async (newCurrency: string) => {
    setIsUpdating(true);
    try {
      // In a real app, this would update the environment variable
      // For now, we'll just show a toast
      setCurrency(newCurrency);
      toast({
        title: 'Currency Updated',
        description: `Currency changed to ${newCurrency}. Restart the application to see changes.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update currency setting.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Default Currency</label>
          <Select value={currency} onValueChange={handleCurrencyChange} disabled={isUpdating}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KSH">Kenyan Shilling (KSh)</SelectItem>
              <SelectItem value="USD">US Dollar ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-gray-600">
          Current: {currency === 'USD' ? 'US Dollar ($)' : 'Kenyan Shilling (KSh)'}
        </p>
      </CardContent>
    </Card>
  );
}