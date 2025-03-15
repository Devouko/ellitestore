import { cn } from "@/lib/utils";

const ProductPrice = ({value,className} : {value:number; className?:string} ) => {
const stringValue=value.toFixed(2)
const [intValue,floatValue]=stringValue.split('.')
console.log(intValue)
//cn is used for dynamic classes
    return (  <p className={cn('text-2xl', className)}>
        <span className="align-super text-xs">ksh.</span>
        {intValue}
        <span className="align-super text-xs">.{floatValue}</span>
    </p>  );
}
 
export default ProductPrice; 