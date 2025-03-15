import { getLatestProducts } from "@/lib/Actions/product.actions";
import ProductList from "@/components/shared/product/product-list";

const Homepage = async() => {
  const latestProducts=await getLatestProducts()

  return ( <ProductList data={latestProducts} title="Newest Arrivals"/> );
}
 
export default Homepage;