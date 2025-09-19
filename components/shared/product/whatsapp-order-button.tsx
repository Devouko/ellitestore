'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface WhatsAppOrderButtonProps {
  product: {
    id: string;
    name: string;
    price: string;
    sellerId?: string;
  };
  sellerWhatsApp?: string;
  quantity?: number;
}

export default function WhatsAppOrderButton({ 
  product, 
  sellerWhatsApp, 
  quantity = 1 
}: WhatsAppOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const handleWhatsAppOrder = async () => {
    setIsLoading(true);
    
    const whatsappNumber = '+254710727775';
    const message = `Hello! I'd like to order:
- Product: ${product.name}
- Quantity: ${quantity}
- Price: KSh ${product.price}
- My Name: ${user?.name || 'Customer'}
- My Address: ${user?.address ? JSON.stringify(user.address) : 'Not provided'}

Please confirm availability and delivery details.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Simulate loading for animation
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Button 
      onClick={handleWhatsAppOrder}
      disabled={isLoading}
      className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300"
      variant="default"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <MessageCircle className="mr-2 h-4 w-4" />
          Order via WhatsApp
        </>
      )}
    </Button>
  );
}