export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { url, username } = req.body;

    try {

        const apiUrl = url
            ? `https://instagram-scraper-api2.p.rapidapi.com/v1/post?url=${encodeURIComponent(url)}`
            : `https://instagram-scraper-api2.p.rapidapi.com/v1/user_posts?username=${encodeURIComponent(username)}`;

        const response = await fetch(apiUrl, {
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "instagram-scraper-api2.p.rapidapi.com"
            }
        });

        const data = await response.json();

        const media = [];

        if (data.data) {

            data.data.forEach(post => {

                if (post.video_url) {
                    media.push({
                        type: "video",
                        url: post.video_url,
                        thumbnail: post.thumbnail_url,
                        quality: "HD"
                    });
                }

                if (post.image_versions2) {
                    post.image_versions2.candidates.forEach(img => {
                        media.push({
                            type: "photo",
                            url: img.url,
                            thumbnail: img.url,
                            quality: "HD"
                        });
                    });
                }

            });

        }

        res.status(200).json({ media });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: "Server error" });

    }

}
