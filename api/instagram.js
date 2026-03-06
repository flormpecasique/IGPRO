export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { url, username } = req.body;

    if (!url && !username) {
      return res.status(400).json({ error: "No URL or username provided" });
    }

    let endpoint = "";
    let body = {};

    // Si el usuario pegó URL
    if (url) {
      endpoint = "https://instagram-public-bulk-scraper.p.rapidapi.com/v1/media_by_url";
      body = { url: url };
    }

    // Si el usuario escribió username
    if (username) {
      endpoint = "https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts";
      body = { username: username };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "instagram-public-bulk-scraper.p.rapidapi.com"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    console.log("API RESPONSE:", data);

    let medias = [];

    if (url) {
      medias = data?.media ? [data.media] : [];
    }

    if (username) {
      medias = data?.items || [];
    }

    if (!medias.length) {
      return res.status(200).json({ media: [] });
    }

    const formatted = medias.map((m, i) => ({
      id: i,
      type: m.video_url ? "video" : "photo",
      thumbnail: m.thumbnail_url || m.display_url,
      quality: "HD",
      caption: m.caption || "Instagram media",
      download: m.video_url || m.display_url
    }));

    res.status(200).json({
      media: formatted
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Server error"
    });

  }

}
