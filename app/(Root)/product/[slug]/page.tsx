import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/Actions/product.actions';
import { notFound } from 'next/navigation';
import ProductPrice from '@/components/shared/product/product-price';
import ProductImages from '@/components/shared/product/product-images';
import AddToCart from '@/components/shared/product/add-to-cart';
import { getMyCart } from '@/lib/Actions/cart.actions';
//import ReviewList from './review-list';
import { auth } from '@/auth';
//import Rating from '@/components/shared/product/rating';

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Page for displaying product details.
 *
 * Fetches a product by slug, and then displays the product details.
 * Also displays a list of customer reviews for the product.
 *
 * @param {Promise<{ slug: string }>} props.params Parameters passed to the page.
 * @returns {JSX.Element} The rendered page.
/*******  a1aceb70-b79c-42c4-90f8-4f1c94ae62b8  *******/
const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const cart = await getMyCart();

  return (
    <>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
          {/* Images Column */}
          <div className='col-span-2'>
            <ProductImages images={product.images} />
          </div>
          {/* Details Column */}
          <div className='col-span-2 p-5'>
            <div className='flex flex-col gap-6'>
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className='h3-bold'>{product.name}</h1>
              <p>{product.numReviews} reviews</p>
              <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                <ProductPrice
                  value={Number(product.price)}
                  className='w-24 rounded-full bg-green-100 text-green-700 px-5 py-2'
                />
              </div>
            </div>
            <div className='mt-10'>
              <p className='font-semibold'>Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Action Column */}
          <div>
            <Card>
              <CardContent className='p-4'>
                <div className='mb-2 flex justify-between'>
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className='mb-2 flex justify-between'>
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant='outline'>In Stock</Badge>
                  ) : (
                    <Badge variant='destructive'>Out Of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className='flex-center'>
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price.toString(),
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
     
    </>
  );
};

export default ProductDetailsPage;
