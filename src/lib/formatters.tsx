export function formatDuration(duration: number){
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60 
    //formatting the hours string
    const minutesString = `${minutes} ${minutes > 1? "minutes": "minute"}`
    const hoursString =    ` ${hours} ${hours > 1 ? "hours": "hour"}`

    if(hours === 0) return minutesString
    if(minutes === 0) return hoursString
    return `${hoursString} ${minutesString}`
}