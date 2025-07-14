import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { object } from "zod"
import qs from 'query-string';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formUrlQuery({
  params, key, value, }: {
    params: string
    key: string
    value: string | null
  }) {
  const query = qs.parse(params)
  query[key] = value

  return qs.stringifyUrl({
    url: window.location.pathname,
    query,
  },
    { skipNull: true }
)
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

const CURRENCY_FORMATTER=new Intl.NumberFormat('en-US',{
  currency:'USD',
  style: 'currency',
  minimumFractionDigits: 2,
})

export function formatCurrency(amount: number | string | null){
  if(typeof amount ==='number' ) {
    return CURRENCY_FORMATTER.format(amount)
  } else if(typeof amount ==='string'){
    return CURRENCY_FORMATTER.format(Number(amount))
  }else{
    return 'NaN'
  }
}
//give the last 6 characters to shorten UUID
export function formatId(id:string)
{

  return `..${id.substring(id.length-6)

  }`
}
// Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};



