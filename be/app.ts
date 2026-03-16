import express, { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());

const PNM_CONFIG = {
  URL: "https://demo.plugnmeet.com",
  API_KEY: "plugnmeet",
  API_SECRET: "zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6",
};

const sendAuthenticatedRequest = async (endpoint: string, body: object) => {
  const bodyString = JSON.stringify(body);

  const signature = crypto
    .createHmac("sha256", PNM_CONFIG.API_SECRET)
    .update(bodyString)
    .digest("hex");

  const url = `${PNM_CONFIG.URL}/auth${endpoint}`;

  const response = await axios.post(url, bodyString, {
    headers: {
      "Content-Type": "application/json",
      "API-KEY": PNM_CONFIG.API_KEY,
      "HASH-SIGNATURE": signature,
    },
  });

  return response.data;
};

app.post("/join-meeting", async (req: Request, res: Response) => {
  const { roomId, userName, userId, isHost } = req.body;

  try {
    const createRoomResponse = await sendAuthenticatedRequest("/room/create", {
      room_id: roomId,
      room_title: "Conference Room",
      metadata: {
        room_title: "Conference Room",
        room_features: {
          allow_webcams: true,
          allow_screen_share: true,
          chat_features: { allow_chat: true },
        },
      },
    });

    if (!createRoomResponse.status) {
      return res.status(400).json({ error: createRoomResponse.msg });
    }

    const tokenResponse = await sendAuthenticatedRequest("/room/getJoinToken", {
      room_id: roomId,
      user_info: {
        name: userName,
        user_id: userId,
        is_admin: isHost || false,
      },
    });

    if (tokenResponse.status) {
      const joinUrl = `${PNM_CONFIG.URL}/?access_token=${tokenResponse.token}`;
      res.json({ joinUrl });
    } else {
      res.status(400).json({ error: tokenResponse.msg });
    }
  } catch (error: any) {
    console.error("PlugNMeet Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
