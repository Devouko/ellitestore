import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { object } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//convert prisma object to a regular object
export function convertPlainObject<T>(data:T){
  return JSON.parse(JSON.stringify(data))
}

//Format numbers to decimal places
export function formatNumberWithDecimalPlaces(num:number):string{
  const [int,decimals]=num.toString().split('.')
  return decimals ? `${int}.${decimals.padEnd(2,'0')}`: `${int}.00`
}
export function formatError(error: any): string{
  if(error.name==='ZodError'){
    //handle Zod Error
    const fieldErrors=Object.keys(error.errors).map((field)=>{
      const message=error.errors[field].message
      return typeof message==='string' ? message : JSON.stringify(message)
  
    })
    return fieldErrors.join('. ')
  }else if(
    error.name==='PrismaClientKnownRequestError' &&
    error.code==='P2002'
  ) {
    //Handle the prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field'
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`

  }else {
    //Handle other errors
    return typeof error.message==='string' ? error.message : JSON.stringify(error.message)
  }
}
export const round2=(value:number | string)=>{
  if(typeof value==='number') {
    return Math.round((value + Number.EPSILON)*100)/100

  }else if(typeof value==='string'){
    return Math.round((Number(value) +Number.EPSILON)*100)/100

  }else
  throw new Error('Value is not a number nor a string')
}