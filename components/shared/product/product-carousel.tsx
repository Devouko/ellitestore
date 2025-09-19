import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

export default function ProductCarousel({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null

  return (
    <div className="relative mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.slice(0, 3).map((product) => (
          <div key={product.id} className="relative overflow-hidden rounded-lg">
            <Image
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-lg mb-4">{formatCurrency(Number(product.price))}</p>
                <Button asChild>
                  <Link href={`/product/${product.slug}`}>
                    Shop Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}