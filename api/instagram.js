export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { url, username } = req.body;

    const query = url || username;

    if (!query) {
      return res.status(400).json({ error: "No URL provided" });
    }

    const params = new URLSearchParams();
    params.append("url", query);

    const response = await fetch(
      "https://instagram-scraper-stable-api.p.rapidapi.com/ig/ig-downloader",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "instagram-scraper-stable-api.p.rapidapi.com"
        },
        body: params
      }
    );

    const data = await response.json();

    console.log("API RESPONSE:", data);

    if (!data || !data.result) {
      return res.status(200).json({ media: [] });
    }

    const medias = data.result.medias || [];

    const formatted = medias.map((m, i) => ({
      id: i,
      type: m.type === "video" ? "video" : "photo",
      thumbnail: m.thumbnail || m.url,
      quality: "HD",
      caption: "Instagram media",
      download: m.url
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
