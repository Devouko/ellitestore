import notFound from "@/app/not-found";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from '@/lib/Actions/product.actions';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";

// Override the PageProps type
type PageProps = {
  params: { slug: string };
};

const ProductDetailsPage = async ({ params }: PageProps) => {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
    return null;
  }

  return (
    <section className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Images column */}
        <div className="col-span-2">
          <ProductImages images={product.images} />
        </div>

        {/* Product details column */}
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            <p className="text-sm text-gray-500">
              {product.brand} / {product.category}
            </p>
            <h1 className="h3-bold">{product.name}</h1>
            <p className="text-sm text-gray-700">
              {product.rating} of {product.numReviews} reviews
            </p>
            <div className="flex flex-col sm:items-center gap-3 sm:flex-row">
              <ProductPrice
                value={Number(product.price)}
                className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
              />
            </div>
          </div>

          <div className="mt-10">
            <p className="font-semibold text-lg mb-2">Description</p>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>

        {/* Action column */}
        <div className="col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex mb-2 justify-between">
                <div className="text-sm text-gray-600">Price</div>
                <div>
                  <ProductPrice value={Number(product.price)} />
                </div>
              </div>
              <div className="mb-2 flex justify-between">
                <div className="text-sm text-gray-600">Status</div>
                {product.stock > 0 ? (
                  <Badge variant="outline">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out Of Stock</Badge>
                )}
              </div>
              {product.stock > 0 && (
                <div className="flex-center">
                  <Button className="w-full">Add To Cart</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;