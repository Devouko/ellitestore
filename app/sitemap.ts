import { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/actions/product.actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts({ query: '', category: 'all', page: '1' })
  
  const productUrls = products.data.map((product) => ({
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...productUrls,
  ]
}