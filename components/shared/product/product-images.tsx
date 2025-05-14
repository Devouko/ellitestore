'use client';


import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square">
        <Image
          src={images[current]}
          alt="Product Image"
          fill
          className="object-cover object-center rounded-lg"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              "border-2 cursor-pointer hover:border-orange-600 rounded-lg transition-all",
              index === current ? "border-orange-600" : "border-transparent"
            )}
          >
            <div className="relative w-20 h-20">
              <Image
                src={image}
                alt="Thumbnail"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;