import "use-server";
import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { addMinutes, endOfDay, startOfDay } from "date-fns";

// Function to retrieve Google Calendar events
export async function getCalendarEventTimes(
    clerkUserId: string,
    { start, end }: { start: Date; end: Date }
) {
    try {
        const oAuthClient = await getOAuthClient(clerkUserId);

        // Ensure OAuth client is available
        if (!oAuthClient) {
            throw new Error("Failed to obtain OAuth client for Clerk user");
        }

        // Make Google Calendar API call
        const events = await google.calendar("v3").events.list({
            calendarId: "primary",
            eventTypes: ["default"],
            singleEvents: true,
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            maxResults: 2500,
            auth: oAuthClient,
        });

        return (
            events.data.items
                ?.map(event => {
                    // Handle events with date or datetime fields
                    if (event.start?.date && event.end?.date) {
                        return {
                            start: startOfDay(event.start.date),
                            end: endOfDay(event.end.date),
                        };
                    }

                    if (event.start?.dateTime && event.end?.dateTime) {
                        return {
                            start: new Date(event.start.dateTime),
                            end: new Date(event.end.dateTime),
                        };
                    }
                })
                .filter(date => date != null) || []
        );
    } catch (error: any) {
        console.error("Error fetching calendar events:", error.message);
        console.error("Details:", error.response?.data || error);
        throw error; // Rethrow error for upstream handling
    }
}

// Function to create a Google Calendar event
export async function createCalendarEvent({
    clerkUserId,
    guestName,
    guestEmail,
    startTime,
    guestNotes,
    duration,
    eventName,
}: {
    clerkUserId: string;
    guestName: string;
    guestEmail: string;
    startTime: Date;
    guestNotes?: string | null;
    duration: number;
    eventName: string;
}) {
    try {
        const oAuthClient = await getOAuthClient(clerkUserId);
        const calendarUser = await (await clerkClient()).users.getUser(clerkUserId);

        if (!calendarUser.primaryEmailAddress) {
            throw new Error("Clerk user has no email");
        }

        const calendarEvent = await google.calendar("v3").events.insert({
            calendarId: "primary",
            auth: oAuthClient,
            sendUpdates: "all",
            requestBody: {
                attendees: [
                    { email: guestEmail, displayName: guestName },
                    {
                        email: calendarUser.primaryEmailAddress.emailAddress,
                        displayName: calendarUser.fullName,
                        responseStatus: "accepted",
                    },
                ],
                description: guestNotes ? `Additional Details: ${guestNotes}` : undefined,
                start: {
                    dateTime: startTime.toISOString(),
                },
                end: {
                    dateTime: addMinutes(startTime, duration).toISOString(),
                },
                summary: `${guestName} + ${calendarUser.fullName}: ${eventName}`,
            },
        });

        return calendarEvent.data;
    } catch (error: any) {
        console.error("Error creating calendar event:", error.message);
        console.error("Details:", error.response?.data || error);
        throw error; // Rethrow error for upstream handling
    }
}

// Function to retrieve the OAuth client from Clerk
async function getOAuthClient(clerkUserId: string) {
    try {
        // Fetch OAuth token from Clerk
        const tokenResponse = await (await clerkClient()).users.getUserOauthAccessToken(
            clerkUserId,
            "oauth_google"
        );

        // Check if token is valid
        if (!tokenResponse.data || tokenResponse.data.length === 0 || !tokenResponse.data[0].token) {
            console.error("No valid OAuth token found for user:", clerkUserId);
            throw new Error("OAuth token not found or invalid");
        }

        // Extract and set the OAuth token
        const token = tokenResponse.data[0].token;
        const client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_AUTHORIZED_REDIRECT_URL
        );

        // Set the token credentials
        client.setCredentials({ access_token: token });

        // Check if the token is expiring and refresh if necessary
        if (client.isTokenExpiring()) {
            const refreshedTokens = await client.refreshAccessToken();
            client.setCredentials(refreshedTokens.credentials);
        }

        return client;
    } catch (error) {
        console.error("Error fetching OAuth token for Clerk user:", clerkUserId, error);
        throw error; // Rethrow error for upstream handling
    }
}
