import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
        <CardHeader className="p-0 items-center">
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            priority={product.images[0] === product.images[0]} // Only prioritize the first image
          />
        </CardHeader>
        <CardContent className="p-4 grid gap-1">
          <div className="text-xs">{product.brand}</div>
          <h2 className="font-medium text-sm">{product.name}</h2>
          <div className="flex-between gap-1">
            <p>{product.rating} stars</p>
            {product.stock > 0 ? (
              <ProductPrice value={Number(product.price)} />
            ) : (
              <p className="text-destructive">Out Of Stock</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;