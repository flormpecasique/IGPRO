export default async function handler(req, res) {

  const { url, username } = req.query;

  let endpoint;

  if (url) {
    endpoint = `https://instagram-scraper-api2.p.rapidapi.com/media_info?url=${url}`;
  } else if (username) {
    endpoint = `https://instagram-scraper-api2.p.rapidapi.com/user_posts?username=${username}`;
  } else {
    return res.status(400).json({ error: "Missing URL or username" });
  }

  try {

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "instagram-scraper-api2.p.rapidapi.com"
      }
    });

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json({
      error: "API request failed"
    });

  }
}
