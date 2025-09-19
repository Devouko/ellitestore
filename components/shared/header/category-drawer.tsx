import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { getAllCategories } from '@/lib/actions/product.actions';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

const CategoryDrawer = async () => {
  let categories = [];
  
  try {
    categories = await getAllCategories();
  } catch (error) {
    console.error('Failed to load categories:', error);
    // Fallback categories when database is unreachable
    categories = [
      { category: 'Electronics', _count: 0 },
      { category: 'Fashion', _count: 0 },
      { category: 'Home & Garden', _count: 0 },
      { category: 'Sports', _count: 0 },
    ];
  }

  return (
    <Drawer direction='left'>
      <DrawerTrigger asChild>
        <Button variant='outline'>
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-full max-w-sm'>
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <div className='space-y-1 mt-4'>
            {categories.map((x) => (
              <Button
                variant='ghost'
                className='w-full justify-start'
                key={x.category}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${x.category}`}>
                    {x.category} {x._count > 0 && `(${x._count})`}
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
