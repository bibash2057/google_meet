import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// const Token = {
//   access_token:
//     "ya29.a0AUMWg_IIR46vP8V56bmPiAD2pApejKa9jECm8IGuAp3p...",
//   refresh_token:
//     "1//0gpynEz7LQX_8CgYIARAAGBASNwF-L9IrJPl6aqXg45BUWbZDfkFYzv..",
//   scope: "https://www.googleapis.com/auth/calendar",
//   token_type: "Bearer",
//   refresh_token_expires_in: 604799,
//   expiry_date: 1770285705764,
// };

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

// if (Token) {
//   console.log("token", Token);
//   oauth2Client.setCredentials({ refresh_token: Token?.refresh_token });
// }

export const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export function getAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

export async function setCredentials(code: string) {
  const { tokens } = await oauth2Client.getToken(code);

  console.log("tokens", tokens);

  oauth2Client.setCredentials(tokens);
}

export function isAuthenticated(): boolean {
  return (
    !!oauth2Client.credentials.refresh_token ||
    !!oauth2Client.credentials.access_token
  );
}

export const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});
