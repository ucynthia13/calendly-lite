import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(time: string) {
  return parseFloat(time.replace(":", "."))
}

export function formatTimezone(timezone: string){
  return Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    timeZoneName: "shortOffset",
    
  }).formatToParts(new Date()).find(part => part.type == "timeZoneName")?.value
}