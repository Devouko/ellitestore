import ProductList from '@/components/shared/product/product-list'
import { getAllProducts } from '@/lib/Actions/product.actions'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string; category: string; price: string; rating: string; sort: string; page: string }
}) {
  const q = searchParams.q || ''
  const category = searchParams.category || ''
  const price = searchParams.price || ''
  const rating = searchParams.rating || ''
  const sort = searchParams.sort || 'newest'
  const page = Number(searchParams.page) || 1

  const { data, totalPages } = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page,
  })

  return (
    <div className="space-y-2">
      <div className="flex-between flex-col md:flex-row">
        <h1 className="h2-bold">
          {q ? `Search results for "${q}"` : 'All Products'}
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {data.length} of {totalPages * 12} results
          </span>
        </div>
      </div>
      
      <ProductList data={data} />
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {/* Pagination component would go here */}
        </div>
      )}
    </div>
  )
}