import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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