import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import path from "node:path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const auth = new google.auth.JWT({
  email: "onllineclass@gen-lang-client-0441189969.iam.gserviceaccount.com",
  key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDAgjead5gYtnrD\nuhuR7zpFcESKMPoLBe5wZFNqRltcSEi7yPUhng814WgrwDLrp/jBRapxRkDRnQl5\n9zC0v6Hv+BRJ+nw0LxZ9IWAczuAbx2diamGR2A2DMUfjnIpCCqOQ3HXHvvifSQDZ\nURA5vH7RlbYvlAO8B5qPCrMZVy3GvG2hXYx72ApetkzkdHmU1GxxvqO1tEVHbuGT\nRAylBkPAoNP7dTkyg85wQJUZPIVtssSF1IeT+5t4Xoz8ulmv+EnJRWP23W9sdE9k\nk6oU5axWQiBiQTXTgzMK7C6MrGJTvrDQ8gakCS7Epq9Ohm/mYfs78iFA+c2b+5cR\nx6AwfwpLAgMBAAECggEAO5PxVm5d1YQgEVQXNT5258ebhrMqp1+yD/mUsUbN/ozm\naauDZeCPb4rvnN6yQ6lr/JCtc7oc1GKH7MW6Pq4yFVzPFqgdaV8LVDWQk8nYpPA9\nCEHJKYRWhjwptgEb7t1xCqOYFfX95voGd7s1TNEP5JgzVp013KrzxAI5NIX9Bkx/\njV1VPaVuQnUJvb9RR1XGcvT3l9XXuS5+CMJTxScDImv1uWr7R64LtarxbPcUePu+\n107fJqaLqa9sVD/IbY0leW/WB77E7Umk2NYAIRvODRxwdmVMxJqQfOfsfzsfO6X5\nWl6XwUDP+oFRiSxpDdCXdQazYFFunzfzRvJKjKCXNQKBgQD0SZrte6qWCW1AJCwk\ndtrh1nwofS3+DIY7y6Sr+wvQWomDGBzn8Zn6JnEhgG124nI9l/uSYKGjk2zHGYTD\nXMC08qmGnPZzgdenb5nDnK8Zy8LCumegtyRTAJrATfyi2F6xj7CZDoff1S8daCqt\noRdp8f3TxIb8qk5xc9BbLHdL1wKBgQDJvRODKev2JiB5i/VenouT0t8+EJPdYlLc\n6IQ6WD4ppQWTBWbv6a/YsmkyDbEx0iOhwYE0saEWd671skk/5mKqUcYinKEolYC3\nWXDPVsKYgxuNZ9xeqxLpAicnydoh1VCSxfEr2h9KnWJgpmYHsyyTLKHO8MdrmjT5\nwgTbX3xGrQKBgQCh9mcUiwhnn2piu1jU+ERYtTbuNUiYBj+9R2Avciu8ATrowsTv\ndvyqoHAjUR3CU5KAidKOkyi35heZza57RHSzw6toB4tSu8R6S4C785cYWEMRjjsE\nkEgyC9WOKGaWpTPrL6RbZgnp+lLZgWXCZmq6oGm0zLjerh+CEtISkOGrUwKBgQC5\nWZu01e5y4ILTydBt17Mb5RGxH2ALdgv15Teft3Wdo32kn8D8yjMDIKBgGY5k3NJa\nCsSgWldLojjAisacDBs4qxskr82t0PZK/sUT6n2tzD+jQvqIjBs6s/yvpNhiX2/A\n+lZj2OsJDeLWM+voRSm+KrKbxEMkzLDBjA4UU/2FnQKBgQCStGvlteo9sZ9HQIR8\nOVHVsnH/hvCV8t/nS46T9zt1h+3VA5SQczTrbYt1UEVN8goFJZ1Y2B3xZXc1/cO/\nOB3kkrx3W1fiJpMGhhOGudfxd1uwvvlaZ/6x/OgnZCYTUMidS8upXs5HByeAnCwE\nH78fkqu6O/XkZwWX+VTDqof42w==\n-----END PRIVATE KEY-----\n".replace(
    /\\n/g,
    "\n",
  ),
  scopes: ["https://www.googleapis.com/auth/calendar"],
  subject: "bibash.thapa7@gmail.com",
});

const calendar = google.calendar({ version: "v3", auth });

app.post("/create-meet", async (req: Request, res: Response) => {
  try {
    console.log("this api hit")
    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: "Math Class",
        start: {
          dateTime: "2026-02-06T10:00:00Z",
          timeZone: "UTC",
        },
        end: {
          dateTime: "2026-02-06T11:00:00Z",
          timeZone: "UTC",
        },
        conferenceData: {
          createRequest: {
            requestId: Date.now().toString(),
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });

    res.json({
      meetLink: response.data.hangoutLink,
      eventId: response.data.id,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// https://meet.google.com/sep-scsx-jwm
