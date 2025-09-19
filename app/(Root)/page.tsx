import ProductList from '@/components/shared/product/product-list';
import {
  getLatestProducts,
  getFeaturedProducts,
} from '@/lib/Actions/product.actions';
import ProductCarousel from '@/components/shared/product/product-carousel';
import ViewAllProductsButton from '@/components/view-all-products-button';
import IconBoxes from '@/components/icon-boxes';
import DealCountdown from '@/components/deal-countdown';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ElliteStore - Premium Online Shopping Experience',
  description: 'Discover amazing deals on electronics, fashion, home goods and more at ElliteStore. Fast shipping, secure payments, and unbeatable prices.',
  keywords: ['online shopping', 'electronics', 'fashion', 'home goods', 'deals', 'fast shipping', 'secure payments'],
  openGraph: {
    title: 'ElliteStore - Premium Online Shopping Experience',
    description: 'Discover amazing deals on electronics, fashion, home goods and more at ElliteStore.',
    type: 'website',
  },
};

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title='Newest Arrivals' limit={4} />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </>
  );
};

export default Homepage;
