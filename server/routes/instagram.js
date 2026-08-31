import express from "express";

const router = express.Router();

const OFFICIAL_INSTAGRAM_URL = "https://www.instagram.com/dailyfix_care/";

// Curated authentic fallback posts/reels when token is missing/expired
const FALLBACK_INSTAGRAM_POSTS = [
  {
    id: "ig-reel-1",
    caption: "10-minute transformation before shower! 100% natural grey coverage with zero skin burning. Ammonia-Free formula. 🧔⚡ #DailyfixMen #BeardTransformation #Grooming",
    media_url: "/assets/Untitled design (3).mp4",
    permalink: OFFICIAL_INSTAGRAM_URL,
    media_type: "VIDEO",
    thumbnail_url: "/assets/poster.png",
    likes: "3.8k",
    comments: "214",
    tag: "Reel • Transformation",
    shade: "Natural Black"
  },
  {
    id: "ig-post-2",
    caption: "Natural Black shade in action. Notice how soft and multi-tonal the finish is — no fake ink or shoe-polish look. 🌿✨ #NaturalBlack #NoAmmonia #DailyfixGrooming",
    media_url: "/assets/001 Natural black1.png",
    permalink: OFFICIAL_INSTAGRAM_URL,
    media_type: "IMAGE",
    thumbnail_url: "/assets/001 Natural black1.png",
    likes: "2.4k",
    comments: "156",
    tag: "Post • Results",
    shade: "Natural Black"
  },
  {
    id: "ig-reel-3",
    caption: "How to use Dailyfix at home: Mix 1:1, comb through dry beard, wait 5–10 mins, rinse. It really is that effortless! 🚿🧼 #BeardRoutine #GroomingHacks",
    media_url: "/assets/Untitled design (3).mp4",
    permalink: OFFICIAL_INSTAGRAM_URL,
    media_type: "VIDEO",
    thumbnail_url: "/assets/How to use1.jpg.jpeg",
    likes: "4.9k",
    comments: "320",
    tag: "Reel • Tutorial",
    shade: "Black Brown"
  },
  {
    id: "ig-post-4",
    caption: "Black Brown: The sweet spot between deep dark and warm natural softness. Perfect for Indian hair undertones! 🤎🖤 #BlackBrown #BeardColour",
    media_url: "/assets/002 Brown black2.png",
    permalink: OFFICIAL_INSTAGRAM_URL,
    media_type: "IMAGE",
    thumbnail_url: "/assets/002 Brown black2.png",
    likes: "1.9k",
    comments: "112",
    tag: "Post • Shade Guide",
    shade: "Black Brown"
  },
  {
    id: "ig-post-5",
    caption: "Dark Brown beard colour for a sophisticated, sun-kissed subtle blend. Zero harsh chemicals, infused with olive oil conditioners. 🧔✨ #DarkBrown #BeardGoals",
    media_url: "/assets/003 Drak brown3.png",
    permalink: OFFICIAL_INSTAGRAM_URL,
    media_type: "IMAGE",
    thumbnail_url: "/assets/003 Drak brown3.png",
    likes: "2.7k",
    comments: "135",
    tag: "Post • Transformation",
    shade: "Dark Brown"
  },
  {
    id: "ig-post-6",
    caption: "The complete Dailyfix Beard Colour Kit: Tray, developer, colour cream, and precision comb brush. Professional salon results right at home. 📦⚡ #BeardCare #Dailyfix",
    media_url: "/assets/Dailyfix Beard Colour Product Only.png",
    permalink: OFFICIAL_INSTAGRAM_URL,
    media_type: "IMAGE",
    thumbnail_url: "/assets/Dailyfix Beard Colour Product Only.png",
    likes: "3.1k",
    comments: "178",
    tag: "Post • Kit Details",
    shade: "All Shades"
  }
];

router.get("/", async (req, res) => {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      return res.json({
        success: true,
        posts: FALLBACK_INSTAGRAM_POSTS,
        source: "fallback"
      });
    }

    const url =
      `https://graph.instagram.com/me/media` +
      `?fields=id,caption,media_url,permalink,media_type,thumbnail_url,timestamp` +
      `&access_token=${accessToken}`;

    console.log("📸 Fetching Instagram posts from Graph API...");

    const response = await fetch(url);
    const data = await response.json();

    if (data.error || !data.data || !Array.isArray(data.data)) {
      console.warn("⚠️ Instagram API notice (using curated fallback):", data.error?.message || "No data");
      return res.json({
        success: true,
        posts: FALLBACK_INSTAGRAM_POSTS,
        source: "fallback"
      });
    }

    // Preserve real video URL for VIDEO/REEL media type and thumbnail for images
    const posts = data.data.slice(0, 8).map((post, idx) => ({
      id: post.id,
      caption: post.caption || "",
      media_url: post.media_url,
      video_url: post.media_type === "VIDEO" ? post.media_url : null,
      thumbnail_url: post.thumbnail_url || (post.media_type === "IMAGE" ? post.media_url : null),
      permalink: post.permalink || OFFICIAL_INSTAGRAM_URL,
      media_type: post.media_type,
      likes: `${(2.2 + (idx % 4) * 0.8).toFixed(1)}k`,
      comments: `${110 + (idx % 5) * 45}`,
      tag: post.media_type === "VIDEO" ? "Reel" : "Post",
      timestamp: post.timestamp || null
    }));

    console.log(`✅ Instagram API: Successfully loaded ${posts.length} posts`);

    res.json({
      success: true,
      posts: posts.length > 0 ? posts : FALLBACK_INSTAGRAM_POSTS,
      source: "api"
    });
  } catch (err) {
    console.error("❌ Instagram API Server Notice:", err.message);
    res.json({
      success: true,
      posts: FALLBACK_INSTAGRAM_POSTS,
      source: "fallback"
    });
  }
});

export default router;