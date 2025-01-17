const express = require("express");
const User = require("../../model/User");
const isSessionValid = require("../../middleware/isSessionValid");
const router = express.Router();
const multer = require("multer");
const Agenda = require("agenda");
const {
  publishToFacebook,
  publishToInstagram,
  publishToXcom
} = require("../../handlers/PostRoutesHandler");
const uploadImagesToCloudinary = require("../../handlers/UploadImageToCloudinary");
const uploadVideosToCloudinary = require("../../handlers/UploadVideoToCloudinary");
const deletemediafromcloudinary = require("../../handlers/DeleteMediaFromCloudinary");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize Agenda for scheduling
const agenda = new Agenda({
  db: { address: `${process.env.DATA_BASE_URL}` }
});

// Schedule a post for publishing
const schedulePost = async (postId, userId) => {
  // Define the publish post job in Agenda
  agenda.define("publish post", async (job) => {
    const { userId, postId } = job.attrs.data;

    // Fetch the user and the specific post by its ID
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const post = user.posts.id(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    try {
      // Publish to platforms based on the post's platform flags
      if (post.platform.fbook) {
        console.log({ message: `posted ${post._id} to fbook for ${user._id}` });
        const fbResult = await publishToFacebook(post, user);
        // post.socialPlatformIds.fbook = fbResult.postId;
        console.log(fbResult);
      }

      if (post.platform.insta) {
        console.log({
          message: `posted ${post._id} to insta for ${user._id}`
        });
        const instaResult = await publishToInstagram(post, user);
        // post.socialPlatformIds.insta = instaResult.postId;
        console.log(instaResult);
      }

      if (post.platform.xcom) {
        console.log({
          message: `posted ${post._id} to xcom for ${user._id}`
        });
        const xcomresult = await publishToXcom(post, user);
        // post.socialPlatformIds.gmb = xcomresult.postId;
        console.log(xcomresult);
      }

      // Update post status to "published"
      post.status = "published";
      await user.save(); // Save the updated user document with post details
      console.log("Post published successfully:", postId);
    } catch (error) {
      console.error("Failed to publish post:", error);
      post.status = "failed"; // Set the post status to "failed" if an error occurs
      await user.save(); // Save the post with updated status
    }
  });

  // Fetch the post and schedule the job at the specified time
  const post = await User.findOne({ "posts._id": postId }, { "posts.$": 1 });

  if (!post || !post.posts.length) {
    throw new Error("Post not found or no valid post in the user document.");
  }

  // Schedule the job to run at the post's scheduled upload date
  await agenda.schedule(
    new Date(post.posts[0].uploadDate), // Use the post's upload date as the scheduled time
    "publish post", // Define the job name
    { userId, postId } // Attach userId and postId as data for the job
  );
};

// Route to create and schedule a post
router.post(
  "/create",
  isSessionValid,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const { text, uploadDate, platform } = req.body;
      const images = req.files.images || [];
      const videos = req.files.videos || [];

      console.log({ image: images, videso: videos });

      const imageUrls = await uploadImagesToCloudinary(images);
      const videoUrls = await uploadVideosToCloudinary(videos);

      const post = {
        text,
        platform: JSON.parse(platform),
        uploadDate: new Date(uploadDate).toISOString(), // Convert local time to UTC
        images: imageUrls,
        videos: videoUrls
      };

      req.user.posts.push(post);
      const savedUser = await req.user.save();
      const newPost = savedUser.posts[savedUser.posts.length - 1];
      await schedulePost(newPost._id, req.user._id);
      console.log("post sheduled sucessfully");
      res
        .status(201)
        .json({ message: "Post created and scheduled", post: newPost });
    } catch (error) {
      console.error("Error creating post:", error);
      // Provide detailed error messages based on the scenario
      const errorMessage = error.message || "Failed to create post";
      res.status(500).json({ error: errorMessage });
    }
  }
);

// Route to get all post
router.get("/all", isSessionValid, async (req, res) => {
  try {
    console.log("getting all posts ...........");
    const posts = req.user.posts;
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scheduled posts" });
  }
});

// Route to retrieve scheduled posts
router.get("/scheduled", isSessionValid, async (req, res) => {
  try {
    console.log("getting scheduled posts ...........");
    const posts = req.user.posts.filter((post) => post.status === "scheduled");
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scheduled posts" });
  }
});

// Route to retrieve published posts
router.get("/published", isSessionValid, async (req, res) => {
  try {
    console.log("getting published posts ...........");
    const posts = req.user.posts.filter((post) => post.status === "published");
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch published posts" });
  }
});

// Route to retrieve faild posts
router.get("/failed", isSessionValid, async (req, res) => {
  try {
    console.log("getting failed posts ...........");
    const posts = req.user.posts.filter((post) => post.status === "failed");
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch published posts" });
  }
});

// Route to retrieve post by ID
router.get("/:id", isSessionValid, async (req, res) => {
  try {
    const post = req.user.posts.id(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Route to update a post
router.put(
  "/:id",
  isSessionValid,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const { text, uploadDate, platform } = req.body;
      const newImages = req.files.images || [];
      const newVideos = req.files.videos || [];

      const post = req.user.posts.id(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Upload new images and videos
      const uploadedImageUrls = await uploadImagesToCloudinary(newImages);
      const uploadedVideoUrls = await uploadVideosToCloudinary(newVideos);

      // Normalize `images` and `videos` fields into arrays
      const existingImages = Array.isArray(req.body.images)
        ? req.body.images
        : req.body.images
        ? [req.body.images]
        : [];

      const existingVideos = Array.isArray(req.body.videos)
        ? req.body.videos
        : req.body.videos
        ? [req.body.videos]
        : [];

      // Filter out invalid URLs (e.g., blob URLs)
      const validImages = existingImages.filter((url) =>
        url.startsWith("https://res.cloudinary.com")
      );
      const validVideos = existingVideos.filter((url) =>
        url.startsWith("https://res.cloudinary.com")
      );

      // Identify removed images and videos
      const removedImages = post.images.filter(
        (url) => !validImages.includes(url)
      );
      const removedVideos = post.videos.filter(
        (url) => !validVideos.includes(url)
      );

      // Delete removed media from Cloudinary
      if (removedImages.length > 0 || removedVideos.length > 0) {
        await deletemediafromcloudinary([...removedImages, ...removedVideos]);
      }

      // Update the post's media with only retained and newly uploaded URLs
      post.images = [...validImages, ...uploadedImageUrls];
      post.videos = [...validVideos, ...uploadedVideoUrls];

      // Update other post fields
      post.text = text || post.text;
      post.status = "scheduled";
      post.uploadDate = uploadDate || post.uploadDate;
      post.platform = platform ? JSON.parse(platform) : post.platform;

      // Save changes and reschedule the post
      await req.user.save();
      await schedulePost(post._id, req.user._id);

      res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  }
);

// Route to delete a post (scheduled or published)
router.delete("/:id", isSessionValid, async (req, res) => {
  try {
    const post = req.user.posts.id(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.images.length) {
      await deletemediafromcloudinary(post.images);
    }

    if (post.videos.length) {
      await deletemediafromcloudinary(post.videos);
    }

    req.user.posts.pull(req.params.id);
    await req.user.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// Start Agenda
agenda.start();

module.exports = router;
