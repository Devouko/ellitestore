'use client';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const openZoom = () => {
    setIsZoomed(true);
    setZoomLevel(1);
  };

  const closeZoom = () => {
    setIsZoomed(false);
    setZoomLevel(1);
  };

  return (
    <div className='space-y-4'>
      <div className='relative group'>
        <Image
          src={images[current]}
          alt='product image'
          width={1000}
          height={1000}
          className='min-h-[300px] object-cover object-center cursor-zoom-in'
          onClick={openZoom}
        />
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={openZoom}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      
      <div className='flex'>
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              'border mr-2 cursor-pointer hover:border-orange-600',
              current === index && 'border-orange-500'
            )}
          >
            <Image src={image} alt='image' width={100} height={100} />
          </div>
        ))}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative max-w-full max-h-full overflow-auto">
            <Image
              src={images[current]}
              alt='zoomed product image'
              width={1200}
              height={1200}
              className="object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            
            {/* Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 1}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 3}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={closeZoom}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={cn(
                      "w-3 h-3 rounded-full border-2",
                      current === index ? "bg-white border-white" : "bg-transparent border-white/50"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
