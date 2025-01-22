export function formatDuration(duration: number) {
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    //formatting the hours string
    const minutesString = `${minutes} ${minutes > 1 ? "minutes" : "minute"}`
    const hoursString = ` ${hours} ${hours > 1 ? "hours" : "hour"}`

    if (hours === 0) return minutesString
    if (minutes === 0) return hoursString
    return `${hoursString} ${minutesString}`
}

export function formatTime(time: string) {
    return parseFloat(time.replace(":", "."))
}

export function formatTimezone(timezone: string) {
    return Intl.DateTimeFormat(undefined, {
        timeZone: timezone,
        timeZoneName: "shortOffset",

    }).formatToParts(new Date()).find(part => part.type == "timeZoneName")?.value
}


const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  })
  
  export function formatDate(date: Date) {
    return dateFormatter.format(date)
  }
  
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: "short",
  })
  
  export function formatTimeString(date: Date) {
    return timeFormatter.format(date)
  }
  
  const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
  
  export function formatDateTime(date: Date) {
    return dateTimeFormatter.format(date)
  }