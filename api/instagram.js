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
      "https://instagram120.p.rapidapi.com/api/instagram/posts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "instagram120.p.rapidapi.com"
        },
        body: JSON.stringify({
          url: query
        })
      }
    );

    const data = await response.json();

    console.log("API RESPONSE:", data);

    if (!data || !data.data) {
      return res.status(200).json({ media: [] });
    }

    const medias = data.data || [];

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
