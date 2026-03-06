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

        const formData = new URLSearchParams();
        formData.append("url", query);

        const response = await fetch("https://instagram-scraper-stable-api.p.rapidapi.com/ig/ig-downloader", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "instagram120.p.rapidapi.com"
            },
            body: formData
        });

        const data = await response.json();

        if (!data) {
            return res.status(500).json({ error: "No response from API" });
        }

        let media = [];

        if (data.data) {

            media = data.data.map((item, index) => ({
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
