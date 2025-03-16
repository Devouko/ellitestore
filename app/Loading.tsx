import Image from "next/image";
import loader from "@/assets/loader.gif";

const LoadingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <Image src={loader} 
      alt="loading ..."
       width={150}
        height={150} 
        priority />
      <p className="mt-4 text-lg font-semibold">Loading...</p>
    </div>
  );
};

export default LoadingPage;