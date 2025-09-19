'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  isFeatured: boolean;
}

export default function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No products found</p>
          <Button asChild className="mt-4">
            <Link href="/seller/products/create">Create Your First Product</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <div className="aspect-square relative">
              <Image
                src={product.images[0] || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
            <div className="space-y-2">
              <p className="text-xl font-bold">{formatCurrency(product.price)}</p>
              <div className="flex justify-between items-center">
                <span>Stock: {product.stock}</span>
                {product.isFeatured && <Badge>Featured</Badge>}
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/seller/products/${product.id}/edit`}>Edit</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/product/${product.id}`}>View</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}