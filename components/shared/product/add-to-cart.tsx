'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus,Minus, ShoppingCart,Loader } from 'lucide-react';
import { addItemToCart,removeItemFromCart } from '@/lib/Actions/cart.actions';
import { Cart, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useTransition } from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-dismiss message after 7s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAddToCart = async () => {
    startTransition(async () => {
      setIsLoading(true);
      const res = await addItemToCart(item);

      if (!res?.success) {
        setMessage(res?.message || 'Failed to add item to cart');
        setIsLoading(false);
        return;
      }

      setMessage(res?.message || 'Item added to cart');
      setIsLoading(false);
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
  const res = await removeItemFromCart(item.productId);
    toast({
      variant: res.success ? 'default' : 'destructive',
      description: res.message,
    });
    return;


    })
  }
  

  // check if item exists in cart
  const existItem = cart && cart.items.find((x: any) => x.productId === item.productId);

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex justify-between items-center p-3 bg-green-50 text-green-700 rounded-md shadow-md border border-green-300"
          >
            <span className="font-medium">{message}</span>
            <Button
              variant="outline"
              size="sm"
              className="dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black text-black border-black hover:bg-black hover:text-white transition-colors"
              onClick={() => router.push('/cart')}
            >
              <ShoppingCart className="mr-1 h-4 w-4" /> View Cart
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {existItem ? (
        <div>
          <Button type='button' variant='outline'
          
            onClick={handleRemoveFromCart}>
                {isPending ? (<Loader className='w-4 h-4 animate-spin'/>):(<Minus className='w-4 h-4' />)  }
          </Button>
          <span className="px-2">{existItem.qty}</span>
          <Button type='button' variant='outline' onClick={handleAddToCart}>
            {isPending ? (<Loader className='w-4 h-4 animate-spin'/>):(<Plus className='w-4 h-4' />)  }
          </Button>
        </div>
      ) : (
        <Button
          className="w-full"
          type="button"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          {isLoading ? (<Loader className="w-4 h-4  animate-spin"/>) : (
            <>
              <Plus className="mr-1" /> Add To Cart
            </>
          )}
        </Button>
      )}
    </div>
  );
};


export default AddToCart;
