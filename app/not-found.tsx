'use client';

import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="flex-center flex-col justify-center items-center min-h-screen">
      <Image
        src="/images/logo.svg" // Ensure the image exists in the public folder
        height={48}
        width={48}
        alt={`${APP_NAME}`}
        priority={true}
      />
      <h1 className="mb-4 font-bold text-3xl">Not Found</h1>
      <p className="text-destructive"> {/* Ensure this class is defined in your CSS */}
        This page could not be found.
      </p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => window.location.assign('/')} // Use this for navigation
      >
        Back To Home
      </Button>
    </div>
  );
};

export default NotFoundPage;