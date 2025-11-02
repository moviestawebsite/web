// =======================
// 📡 server.js — Node.js Proxy for YouTube Live
// =======================
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = "AIzaSyCTjK97VrKfcu9zeV3V4PnPPE_UzfpSPOs";
const CHANNEL_ID = "UCHxZfWDxxumOyTN0nvbRM5A";

app.get("/live", async (req, res) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const liveVideoId = data.items[0].id.videoId;
      res.json({ live: true, id: liveVideoId });
    } else {
      res.json({ live: false });
    }
  } catch (error) {
    console.error("Error fetching live data:", error);
    res.status(500).json({ error: "Failed to fetch live status" });
  }
});

app.listen(3000, () => {
  console.log("✅ Node.js server running on http://localhost:3000");
});
