'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ViewAllProductsButton() {
  return (
    <div className="flex justify-center my-8">
      <Button asChild>
        <Link href="/search">View All Products</Link>
      </Button>
    </div>
  )
}