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

        const response = await fetch("https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/get-info-rapidapi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com"
            },
            body: JSON.stringify({
                url: query
            })
        });

        const data = await response.json();

        if (!data) {
            return res.status(500).json({ error: "No data returned from API" });
        }

        let media = [];

        if (data.medias) {

            media = data.medias.map((item, index) => ({
                id: index,
                type: item.type === "video" ? "video" : "photo",
                thumbnail: item.thumbnail || item.url,
                quality: "HD",
                caption: "Instagram Media",
                download: item.url
            }));

        }

        res.status(200).json({ media });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error"
        });

    }
}
