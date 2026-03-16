import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  calendar,
  getAuthUrl,
  setCredentials,
  isAuthenticated,
} from "./google";
import path from "node:path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const KEY_FILE_PATH = path.join(__dirname, "service-account-key.json");

app.get("/auth/google", (req: Request, res: Response) => {
  res.redirect(getAuthUrl());
});

app.get("/auth/google/callback", async (req: Request, res: Response) => {
  try {
    console.log("callback req", req);
    const code = req.query.code as string;
    await setCredentials(code);
    res.send("Google authentication successful. You can close this tab.");
  } catch (error) {
    res.status(500).send("Authentication failed");
  }
});

app.post("/create-meet", async (req: Request, res: Response) => {
  if (!isAuthenticated()) {
    return res.status(401).json({
      error: "Google OAuth not completed. Visit /auth/google first.",
    });
  }

  try {
    const { attendeeEmail, recurrence } = req.body;
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const event = {
      summary: "Instant Google Meet",
      description: "some des goes here",
      start: { dateTime: now.toISOString() },
      end: { dateTime: oneHourLater.toISOString() },
      // attendees: attendeeEmail ? [{ email: attendeeEmail }] : [],
      // recurrence: recurrence ? [recurrence] : [],

      attendees: [{ email: "test@test.com" }],
      recurrence: ["RRULE:FREQ=WEEKLY;BYDAY=MO;COUNT=10"],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {...event, },
      conferenceDataVersion: 1,
    });

    res.json({
      res: response?.data,
      meetLink: response.data.hangoutLink,
      eventId: response.data.id,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// https://meet.google.com/sep-scsx-jwm
