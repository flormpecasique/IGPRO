// backend/server.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url, username } = req.body;

  if (!url && !username) {
    return res.status(400).json({ error: "Please provide an Instagram URL or username" });
  }

  try {
    const apiUrl = "https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index"; // ejemplo, cambia según tu API
    const query = username ? `?username=${encodeURIComponent(username)}` : `?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl + query, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "instagram-downloader-download-instagram-videos-stories.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();

    // Estandarizamos la respuesta para el frontend
    const media = (data.media || []).map((item, index) => ({
      id: index,
      type: item.type || "photo",
      url: item.url || item.download_url || "",
      thumbnail: item.thumbnail || item.url || "",
      caption: item.caption || "",
      quality: item.quality || "HD",
    }));

    res.status(200).json({ media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
