import Review from "../models/Review.js";
import Product from "../models/Product.js";

// Curated starter positive reviews with realistic testimonials
export const INITIAL_DUMMY_REVIEWS = [
  // 1. Natural Black Reviews
  {
    productSlug: "natural-black-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Natural Black",
    author: "Vikram Singhania",
    email: "vikram.s88@gmail.com",
    rating: 5,
    headline: "100% Grey Coverage with Zero Skin Staining – Best Beard Colour Ever!",
    content: "I have tried 4 different commercial beard dyes before Dailyfix, and all of them left itchy dark stains on my facial skin. Dailyfix Natural Black is on another level! Applied it for just 10 minutes, rinsed it off, and every single grey chin hair was covered with a deep, natural black finish. No fake jet-black ink look, just a rich healthy sheen. Will keep subscribing!",
    shade: "Natural Black",
    verified: true,
    status: "Approved",
    helpfulCount: 42,
    isFeatured: true,
    tags: ["Ammonia-Free", "Zero Staining", "Natural Finish", "10-Min Fast"],
    skinType: "Sensitive Skin",
    usageDuration: "Using for 4 months",
    location: "Mumbai, MH",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "natural-black-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Natural Black",
    author: "Dr. Sameer Kulkarni",
    email: "dr.sameer.k@outlook.com",
    rating: 5,
    headline: "Zero burning sensation or irritation. Truly ammonia-free.",
    content: "Being a dermatologist, I am very critical of hair and beard colouring products due to ammonia and harsh oxidizers. Dailyfix formulation is remarkably mild. No burning, no foul chemical smell, and no irritation around the sensitive mustache area. Excellent grey coverage that looks completely natural.",
    shade: "Natural Black",
    verified: true,
    status: "Approved",
    helpfulCount: 38,
    isFeatured: true,
    tags: ["Dermatologist Approved", "No Burning", "Gentle on Skin"],
    skinType: "Very Sensitive Skin",
    usageDuration: "Regular Buyer (3rd Pack)",
    location: "Pune, MH",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "natural-black-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Natural Black",
    author: "Aakash Verma",
    email: "aakash.verma91@gmail.com",
    rating: 5,
    headline: "My wife couldn't even tell I dyed it – it looks so natural!",
    content: "Was hesitant to dye my salt-and-pepper beard because I didn't want that fake painted look. Dailyfix Natural Black blends so seamlessly with my original hair texture. The colour stayed vibrant for over 3 weeks without fading into weird reddish tones. Super easy applicator tray too.",
    shade: "Natural Black",
    verified: true,
    status: "Approved",
    helpfulCount: 29,
    isFeatured: false,
    tags: ["Seamless Blend", "Long Lasting", "Easy Applicator"],
    skinType: "Normal Skin",
    usageDuration: "First Time User",
    location: "Bengaluru, KA",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "natural-black-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Natural Black",
    author: "Rajesh Nair",
    email: "rajesh.nair@tcs.com",
    rating: 5,
    headline: "Great value for money and lasts a solid 3-4 weeks",
    content: "A single pack gives me two full applications. The colour holds up very well even after daily face washes and beard oil routines. Very impressed with the quality and quick delivery.",
    shade: "Natural Black",
    verified: true,
    status: "Approved",
    helpfulCount: 17,
    isFeatured: false,
    tags: ["Value for Money", "Holds with Beard Oil"],
    skinType: "Combination Skin",
    usageDuration: "Using for 2 months",
    location: "Kochi, KL",
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "natural-black-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Natural Black",
    author: "Karan Malhotra",
    email: "karan.malhotra@gmail.com",
    rating: 4,
    headline: "Quick, effective and leaves beard feeling soft",
    content: "Takes barely 10 minutes before shower. Other colours used to make my beard bristles stiff and dry, but this one left the hair feeling surprisingly soft. Good natural black shade.",
    shade: "Natural Black",
    verified: true,
    status: "Approved",
    helpfulCount: 14,
    isFeatured: false,
    tags: ["Soft Beard", "Quick Routine"],
    skinType: "Normal Skin",
    usageDuration: "Using for 1 month",
    location: "Delhi NCR",
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
  },

  // 2. Black Brown Reviews
  {
    productSlug: "black-brown-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Black Brown",
    author: "Rohit Sharma",
    email: "rohit.sharma82@gmail.com",
    rating: 5,
    headline: "The absolute perfect shade for Indian skin tones!",
    content: "Pure black sometimes looks too harsh on my face, but this Black Brown shade is pure perfection. It has a warm, sophisticated undertone that matches my natural hair colour perfectly. Covered 100% of my grey sideburns and mustache. Highly recommended!",
    shade: "Black Brown",
    verified: true,
    status: "Approved",
    helpfulCount: 45,
    isFeatured: true,
    tags: ["Perfect Shade", "Warm Tone", "Full Coverage"],
    skinType: "Sensitive Skin",
    usageDuration: "Using for 6 months",
    location: "Mumbai, MH",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "black-brown-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Black Brown",
    author: "Devendra Kapoor",
    email: "devendra.kapoor@gmail.com",
    rating: 5,
    headline: "Smooth application and no harsh chemical odor",
    content: "The best part is how pleasant the experience is—no eye-watering fumes or tingling on the cheeks. The Black Brown shade looks super classy in daylight. Friends noticed a fresher look right away.",
    shade: "Black Brown",
    verified: true,
    status: "Approved",
    helpfulCount: 31,
    isFeatured: true,
    tags: ["No Chemical Smell", "Natural in Daylight", "Classy Tone"],
    skinType: "Normal Skin",
    usageDuration: "Regular Customer",
    location: "Jaipur, RJ",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "black-brown-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Black Brown",
    author: "Siddharth Oberoi",
    email: "sid.oberoi@yahoo.com",
    rating: 5,
    headline: "Doesn't stain the skin beneath the beard",
    content: "Was very worried about dark patches on my neck and cheeks after washing. But this washes off cleanly from the skin while locking onto the hair strands securely. Premium product quality.",
    shade: "Black Brown",
    verified: true,
    status: "Approved",
    helpfulCount: 22,
    isFeatured: false,
    tags: ["Skin Safe", "Clean Wash", "Premium Quality"],
    skinType: "Dry Skin",
    usageDuration: "First Time Buyer",
    location: "Chandigarh, PB",
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "black-brown-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Black Brown",
    author: "Arjun Mehta",
    email: "arjun.m@gmail.com",
    rating: 5,
    headline: "Subtle and sophisticated grey coverage",
    content: "Gives a very distinguished look. I only had about 30% grey hair around my chin, and it blended everything uniformly without looking artificial. Application took less than 15 mins total.",
    shade: "Black Brown",
    verified: true,
    status: "Approved",
    helpfulCount: 16,
    isFeatured: false,
    tags: ["Uniform Tone", "Fast & Convenient"],
    skinType: "Sensitive Skin",
    usageDuration: "Using for 3 months",
    location: "Ahmedabad, GJ",
    createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "black-brown-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Black Brown",
    author: "Praveen Rao",
    email: "praveen.rao@gmail.com",
    rating: 4,
    headline: "Very satisfied with the natural finish",
    content: "Great shade and longevity. Stays intact through regular beard grooming and showers. Delivery arrived within 2 days with nice packaging.",
    shade: "Black Brown",
    verified: true,
    status: "Approved",
    helpfulCount: 11,
    isFeatured: false,
    tags: ["Fast Shipping", "Natural Finish"],
    skinType: "Normal Skin",
    usageDuration: "Verified Customer",
    location: "Hyderabad, TS",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },

  // 3. Dark Brown Reviews
  {
    productSlug: "dark-brown-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Dark Brown",
    author: "Anand Vardhan",
    email: "anand.vardhan@gmail.com",
    rating: 5,
    headline: "Rich chocolate hue, zero brassy red tones – simply outstanding!",
    content: "Most brown beard dyes turn copper or brassy orange after a week of sunlight exposure. Dailyfix Dark Brown stays true to its deep chocolate brown hue throughout 3 whole weeks! It gives a sharp, groomed, executive look. Very satisfied.",
    shade: "Dark Brown",
    verified: true,
    status: "Approved",
    helpfulCount: 48,
    isFeatured: true,
    tags: ["No Brassy Tones", "Deep Chocolate Hue", "Sunlight Resistant"],
    skinType: "Normal Skin",
    usageDuration: "Using for 5 months",
    location: "Pune, MH",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "dark-brown-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Dark Brown",
    author: "Manish Guha",
    email: "manish.guha@gmail.com",
    rating: 5,
    headline: "Gentlest beard colour I've ever put on my face",
    content: "I have eczema-prone skin and usually react badly to dyes. Dailyfix caused zero flare-ups or redness. The dark brown tone matches my hair highlights beautifully. 10/10 from me.",
    shade: "Dark Brown",
    verified: true,
    status: "Approved",
    helpfulCount: 34,
    isFeatured: true,
    tags: ["Eczema Safe", "Zero Flare-Ups", "Matches Highlights"],
    skinType: "Eczema / Highly Sensitive",
    usageDuration: "Regular User (4th Box)",
    location: "Kolkata, WB",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "dark-brown-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Dark Brown",
    author: "Tanmay Deshmukh",
    email: "tanmay.d@gmail.com",
    rating: 5,
    headline: "Effortless application with salon-like finish at home",
    content: "I used to pay 500 bucks at the salon every 2 weeks just for beard grooming. Doing it myself with Dailyfix takes 10 minutes at home with even better results and softer beard hair.",
    shade: "Dark Brown",
    verified: true,
    status: "Approved",
    helpfulCount: 26,
    isFeatured: false,
    tags: ["Saves Salon Money", "Soft Hair", "10-Minute Home Care"],
    skinType: "Combination Skin",
    usageDuration: "Using for 3 months",
    location: "Nagpur, MH",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "dark-brown-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Dark Brown",
    author: "Gaurav Sen",
    email: "gaurav.sen@gmail.com",
    rating: 5,
    headline: "Solid grey coverage and rich, shiny finish",
    content: "Hides all grey hairs in the beard and mustache with a natural shine. The texture is creamy and doesn't drip down the neck during the 10 min waiting time.",
    shade: "Dark Brown",
    verified: true,
    status: "Approved",
    helpfulCount: 19,
    isFeatured: false,
    tags: ["No Drip Cream", "Natural Shine"],
    skinType: "Normal Skin",
    usageDuration: "First Time Buyer",
    location: "Indore, MP",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    productSlug: "dark-brown-beard-colour",
    productName: "Dailyfix Men's Beard Colour – Dark Brown",
    author: "Harish Iyer",
    email: "harish.iyer@gmail.com",
    rating: 4,
    headline: "Very good product, natural deep tone",
    content: "Simple instructions and great coverage. Doesn't feel heavy on the beard. Highly recommend the dark brown shade for a subtle finish.",
    shade: "Dark Brown",
    verified: true,
    status: "Approved",
    helpfulCount: 13,
    isFeatured: false,
    tags: ["Subtle Finish", "Lightweight Formula"],
    skinType: "Sensitive Skin",
    usageDuration: "Verified Customer",
    location: "Chennai, TN",
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
  },
];

/**
 * Auto-seed helper to ensure database has initial positive reviews if empty
 */
async function autoSeedIfEmpty() {
  try {
    const count = await Review.countDocuments();
    if (count === 0) {
      console.log("🌱 Auto-seeding initial positive reviews into MongoDB...");
      await Review.insertMany(INITIAL_DUMMY_REVIEWS);
      console.log("✅ Seeded initial reviews successfully!");
    }
  } catch (err) {
    console.warn("⚠ Review auto-seed notice:", err.message);
  }
}

// Normalize slug matching helper
function normalizeSlug(slug) {
  if (!slug) return "natural-black-beard-colour";
  const s = String(slug).toLowerCase();
  if (s.includes("natural") && s.includes("black")) return "natural-black-beard-colour";
  if (s.includes("black") && s.includes("brown")) return "black-brown-beard-colour";
  if (s.includes("dark") && s.includes("brown")) return "dark-brown-beard-colour";
  if (s === "natural-black") return "natural-black-beard-colour";
  if (s === "black-brown") return "black-brown-beard-colour";
  if (s === "dark-brown") return "dark-brown-beard-colour";
  return s;
}

/**
 * GET /api/reviews/product/:slugOrId
 * Public: Get approved reviews and aggregated rating stats for a product
 */
export const getReviewsForProduct = async (req, res) => {
  try {
    await autoSeedIfEmpty();

    const { slugOrId } = req.params;
    const normalized = normalizeSlug(slugOrId);

    // Find reviews by exact slug or matching keywords
    const reviews = await Review.find({
      status: "Approved",
      $or: [
        { productSlug: normalized },
        { productSlug: slugOrId },
        { productSlug: { $regex: new RegExp(slugOrId.replace(/-/g, ".*"), "i") } },
      ],
    }).sort({ isFeatured: -1, createdAt: -1 });

    // If no matching reviews for a custom product, return generic positive reviews
    let finalReviews = reviews;
    if (finalReviews.length === 0) {
      finalReviews = await Review.find({ status: "Approved" }).sort({ helpfulCount: -1 }).limit(6);
    }

    // Calculate dynamic stats
    const totalReviews = finalReviews.length;
    const ratingSum = finalReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const averageRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : "4.9";

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    finalReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      ratingDistribution[star] = (ratingDistribution[star] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalReviews,
        averageRating: Number(averageRating),
        recommendationRate: 98,
        ratingDistribution,
        satisfactionMetrics: {
          greyCoverage: 99,
          skinComfort: 98,
          naturalFinish: 97,
          longLasting: 96,
        },
      },
      reviews: finalReviews,
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ success: false, message: "Failed to load reviews" });
  }
};

/**
 * POST /api/reviews
 * Public: Customer writes and submits a new review
 */
export const createReview = async (req, res) => {
  try {
    const {
      productSlug,
      productName,
      author,
      email,
      rating,
      headline,
      content,
      shade,
      skinType,
      usageDuration,
    } = req.body;

    if (!author || !headline || !content || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (Name, Rating, Headline, Review).",
      });
    }

    const numRating = Math.min(5, Math.max(1, Number(rating) || 5));
    const normalizedSlug = normalizeSlug(productSlug);

    const newReview = await Review.create({
      productSlug: normalizedSlug,
      productName: productName || "Dailyfix Men's Beard Colour",
      author: String(author).trim(),
      email: String(email || "").trim(),
      rating: numRating,
      headline: String(headline).trim(),
      content: String(content).trim(),
      shade: shade || "Natural Black",
      verified: true,
      status: "Approved", // Approved immediately for fast visibility
      helpfulCount: 0,
      isFeatured: false,
      tags: ["Customer Review", "Verified Buyer"],
      skinType: skinType || "Normal Skin",
      usageDuration: usageDuration || "Verified Customer",
    });

    res.status(201).json({
      success: true,
      message: "Thank you! Your review has been published successfully.",
      review: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, message: "Failed to submit review" });
  }
};

/**
 * POST /api/reviews/:id/helpful
 * Public: Upvote review helpfulness
 */
export const voteHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, helpfulCount: review.helpfulCount });
  } catch (error) {
    console.error("Error voting review helpful:", error);
    res.status(500).json({ success: false, message: "Failed to register vote" });
  }
};

/**
 * GET /api/reviews/admin
 * Admin: Get all reviews with status/rating/search filtering and pagination
 */
export const getAdminReviews = async (req, res) => {
  try {
    await autoSeedIfEmpty();

    const { status, rating, search, productSlug, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (rating && rating !== "All") {
      filter.rating = Number(rating);
    }

    if (productSlug && productSlug !== "All") {
      filter.productSlug = normalizeSlug(productSlug);
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { author: { $regex: q, $options: "i" } },
        { headline: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { shade: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, totalCount] = await Promise.all([
      Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Review.countDocuments(filter),
    ]);

    // Dashboard stats
    const [totalAll, approvedCount, pendingCount, rejectedCount, fiveStarCount] = await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({ status: "Approved" }),
      Review.countDocuments({ status: "Pending" }),
      Review.countDocuments({ status: "Rejected" }),
      Review.countDocuments({ rating: 5 }),
    ]);

    res.json({
      success: true,
      stats: {
        totalAll,
        approvedCount,
        pendingCount,
        rejectedCount,
        fiveStarCount,
      },
      pagination: {
        total: totalCount,
        page: Number(page),
        pages: Math.ceil(totalCount / Number(limit)),
        limit: Number(limit),
      },
      reviews,
    });
  } catch (error) {
    console.error("Error in getAdminReviews:", error);
    res.status(500).json({ success: false, message: "Failed to fetch admin reviews" });
  }
};

/**
 * PUT /api/reviews/admin/:id/status
 * Admin: Update review status (Approved / Pending / Rejected)
 */
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!["Approved", "Pending", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updateData = { status };
    if (typeof adminNotes === "string") updateData.adminNotes = adminNotes;

    const review = await Review.findByIdAndUpdate(id, updateData, { new: true });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({
      success: true,
      message: `Review marked as ${status}`,
      review,
    });
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ success: false, message: "Failed to update review status" });
  }
};

/**
 * PUT /api/reviews/admin/:id/feature
 * Admin: Toggle featured status of a review
 */
export const toggleFeatureReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    review.isFeatured = !review.isFeatured;
    await review.save();

    res.json({
      success: true,
      message: review.isFeatured ? "Review marked as Featured" : "Review unfeatured",
      isFeatured: review.isFeatured,
    });
  } catch (error) {
    console.error("Error toggling feature review:", error);
    res.status(500).json({ success: false, message: "Failed to toggle featured status" });
  }
};

/**
 * DELETE /api/reviews/admin/:id
 * Admin: Delete a review
 */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};

/**
 * POST /api/reviews/admin/seed-dummy
 * Admin: Populate or reset curated positive reviews
 */
export const seedDummyReviews = async (req, res) => {
  try {
    const { replaceAll = false } = req.body;

    if (replaceAll) {
      await Review.deleteMany({});
    }

    const inserted = await Review.insertMany(INITIAL_DUMMY_REVIEWS);
    res.json({
      success: true,
      message: `Successfully seeded ${inserted.length} positive reviews!`,
      count: inserted.length,
    });
  } catch (error) {
    console.error("Error seeding dummy reviews:", error);
    res.status(500).json({ success: false, message: "Failed to seed reviews" });
  }
};
