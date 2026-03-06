export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { url, username } = req.body;
    const query = url || username;

    if (!query) {
      return res.status(400).json({ error: "No URL or username provided" });
    }

    const response = await fetch(
      "https://instagram-scraper-stable-api.p.rapidapi.com/get_ig_user_followers_v2.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "instagram-scraper-stable-api.p.rapidapi.com"
        },
        body: JSON.stringify({
          url: query
        })
      }
    );

    const data = await response.json();

    console.log("API RESPONSE:", data);

    const medias =
      data?.result?.medias ||
      data?.data ||
      data?.medias ||
      [];

    if (!medias.length) {
      return res.status(200).json({ media: [] });
    }

    const formatted = medias.map((m, i) => ({
      id: i,
      type: m.type === "video" ? "video" : "photo",
      thumbnail: m.thumbnail || m.url,
      quality: "HD",
      caption: "Instagram media",
      download: m.url || m.download
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
