"use-server"

import { clerkClient } from "@clerk/nextjs/server"
import { google } from "googleapis"
import { endOfDay, startOfDay} from "date-fns"

export default async function getCalendarEvents(clerkUserId: string, {start, end}: {start: Date, end: Date}){
    const oAuthClient = await getOAuthClient(clerkUserId)
    const events = await google.calendar("v3").events.list({
        calendarId: "primary",
        eventTypes: ["default"],
        singleEvents: true,
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        maxResults: 2500,
        auth: oAuthClient
    })

    //return events or empty array
    return events?.data.items?.map((event) => {
        //check if event has date
        if (event.start?.date != null && event.end?.date != null) {
            return{
                start: startOfDay(event.start.date),
                end: endOfDay(event.end.date)
            }
        }
        if(event.start?.dateTime != null && event.end?.dateTime){
            return{
                start: new Date(event.start.dateTime),
                end: new Date(event.end.dateTime)
            }
        }
    }).filter(date => date != null) || []

}

async function getOAuthClient(clerkUserId: string) {
    const token = (await clerkClient()).users.getUserOauthAccessToken(clerkUserId, "oauth_google")
    if((await token).data.length===0 || (await token).data[0].token == null){
        return
    }

    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.AUTHORIZED_REDIRECT_URL
    )

    client.setCredentials({access_token: (await token).data[0].token})

    return client
}