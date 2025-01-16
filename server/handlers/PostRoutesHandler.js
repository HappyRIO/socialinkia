// socialPostPublishers.js
const axios = require("axios");
const User = require("../model/User");
const { TwitterApi } = require("twitter-api-v2");

const publishToInstagram = async (post, user) => {
  const { images, videos } = post; // Arrays of images and videos
  const caption = post.text;

  if (
    !caption &&
    (!images || images.length === 0) &&
    (!videos || videos.length === 0)
  ) {
    throw new Error("Caption, image URLs, or video URLs are required.");
  }

  console.log("Publishing to Instagram...");

  try {
    // Fetch user details from the database
    const dbUser = await User.findById(user._id);

    if (!dbUser || !dbUser.selectedInstagramBusinessPage) {
      throw new Error("User Instagram credentials not found.");
    }

    const { id: instagramBusinessAccountId, accessToken } =
      dbUser.selectedInstagramBusinessPage;

    // Debugging: Log critical information
    console.log({
      instagramBusinessAccountId,
      accessToken,
      images,
      videos
    });

    const postResults = []; // Store results of each published post

    // Process and publish images one by one
    if (images && images.length > 0) {
      for (const imageUrl of images) {
        console.log(`Uploading image: ${imageUrl}`);

        // Create a media container for the current image
        const imageResponse = await axios.post(
          `https://graph.facebook.com/v17.0/${instagramBusinessAccountId}/media`,
          {
            image_url: imageUrl,
            caption,
            access_token: accessToken
          }
        );

        const mediaContainerId = imageResponse.data.id;
        console.log("Image container created:", mediaContainerId);

        // Publish the image from the media container
        const publishResponse = await axios.post(
          `https://graph.facebook.com/v17.0/${instagramBusinessAccountId}/media_publish`,
          {
            creation_id: mediaContainerId,
            access_token: accessToken
          }
        );

        console.log("Image published successfully:", publishResponse.data);
        postResults.push({
          type: "image",
          postId: publishResponse.data.id
        });
      }
    }

    // Process and publish videos one by one
    if (videos && videos.length > 0) {
      for (const videoUrl of videos) {
        console.log(`Uploading video: ${videoUrl}`);

        // Create a media container for the current video
        const videoResponse = await axios.post(
          `https://graph.facebook.com/v17.0/${instagramBusinessAccountId}/media`,
          {
            video_url: videoUrl,
            caption,
            access_token: accessToken
          }
        );

        const mediaContainerId = videoResponse.data.id;
        console.log("Video container created:", mediaContainerId);

        // Publish the video from the media container
        const publishResponse = await axios.post(
          `https://graph.facebook.com/v17.0/${instagramBusinessAccountId}/media_publish`,
          {
            creation_id: mediaContainerId,
            access_token: accessToken
          }
        );

        console.log("Video published successfully:", publishResponse.data);
        postResults.push({
          type: "video",
          postId: publishResponse.data.id
        });
      }
    }

    console.log("All media published successfully:", postResults);

    return {
      success: true,
      results: postResults
    };
  } catch (error) {
    console.error(
      "Error posting content on Instagram:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error?.message ||
        "Failed to post content on Instagram."
    );
  }
};

const publishToFacebook = async (post, user) => {
  const { images, videos } = post;
  const message = post.text;

  if (
    !message &&
    (!images || images.length === 0) &&
    (!videos || videos.length === 0)
  ) {
    throw new Error("Message, image URL, or video URL is required.");
  }

  console.log("Publishing to Facebook...");

  try {
    // Fetch user from the database
    const dbUser = await User.findById(user._id);

    if (!dbUser || !dbUser.selectedFacebookBusinessPage) {
      throw new Error("User not found or Facebook access token is missing.");
    }

    const { id: pageId, accessToken } = dbUser.selectedFacebookBusinessPage;

    if (!pageId || !accessToken) {
      throw new Error("Facebook Business Page credentials are incomplete.");
    }

    // Prepare media containers for images and videos
    const attachedMedia = [];

    // Process images
    if (images && images.length > 0) {
      console.log("Creating media containers for images...");
      for (const imageUrl of images) {
        const response = await axios.post(
          `https://graph.facebook.com/v17.0/${pageId}/photos`,
          {
            access_token: accessToken,
            url: imageUrl,
            published: false // Media container should not be published directly
          }
        );
        attachedMedia.push({ media_fbid: response.data.id }); // Add media container ID
      }
      console.log("Image media containers created:", attachedMedia);
    }

    // Process videos
    if (videos && videos.length > 0) {
      console.log("Creating media containers for videos...");
      for (const videoUrl of videos) {
        const response = await axios.post(
          `https://graph.facebook.com/v17.0/${pageId}/videos`,
          {
            access_token: accessToken,
            file_url: videoUrl,
            published: false // Media container should not be published directly
          }
        );
        attachedMedia.push({ media_fbid: response.data.id }); // Add media container ID
      }
      console.log("Video media containers created:", attachedMedia);
    }

    // Publish the post with attached media
    const postResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${pageId}/feed`,
      {
        access_token: accessToken,
        message, // Post caption or message
        attached_media: attachedMedia // Attach all media
      }
    );

    const postId = postResponse.data.id;

    console.log("Post published successfully on Facebook!", postId);
    return {
      success: true,
      postId
    };
  } catch (error) {
    console.error(
      "Error posting content on Facebook:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error?.message ||
        "Failed to post content on Facebook."
    );
  }
};

const publishToXcom = async (post, user) => {
  try {
    if (
      !user ||
      !user.selectedXcom?.accessToken ||
      !user.selectedXcom?.refreshToken
    ) {
      throw new Error("Invalid user or tokens");
    }

    if (!post || !post.text) {
      throw new Error("Post content is required");
    }

    const refreshAccessToken = async (refreshToken) => {
      const client = new TwitterApi({
        clientId,
        clientSecret
      });

      try {
        const {
          client: refreshedClient,
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn
        } = await client.refreshOAuth2Token(refreshToken);

        // Update the user's tokens in the database
        await User.findByIdAndUpdate(user._id, {
          "selectedXcom.accessToken": accessToken,
          "selectedXcom.refreshToken": newRefreshToken,
          "selectedXcom.tokenExpiry": new Date(Date.now() + expiresIn * 1000)
        });

        console.log("Access token refreshed successfully");
        return accessToken;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        throw new Error(
          "Could not refresh access token. Please reauthenticate."
        );
      }
    };

    // Check token expiry and refresh if needed
    if (new Date() > new Date(user.selectedXcom.tokenExpiry)) {
      console.log("Access token expired, refreshing...");
      user.selectedXcom.accessToken = await refreshAccessToken(
        user.selectedXcom.refreshToken
      );
    }

    // Initialize Twitter client with (potentially refreshed) access token
    const client = new TwitterApi(user.selectedXcom.accessToken);

    // Prepare media uploads
    const mediaIds = [];
    if (post.images && post.images.length > 0) {
      for (const imageUrl of post.images) {
        console.log(`Uploading image: ${imageUrl}`);
        const imageResponse = await axios.get(imageUrl, {
          responseType: "arraybuffer"
        });
        const mediaId = await client.v1.uploadMedia(
          Buffer.from(imageResponse.data),
          {
            mimeType: imageResponse.headers["content-type"]
          }
        );
        mediaIds.push(mediaId);
        console.log(`Uploaded mediaId: ${mediaId}`);
      }
    }

    if (post.videos && post.videos.length > 0) {
      for (const videoUrl of post.videos) {
        console.log(`Uploading video: ${videoUrl}`);
        const videoResponse = await axios.get(videoUrl, {
          responseType: "arraybuffer"
        });
        const mediaId = await client.v1.uploadMedia(
          Buffer.from(videoResponse.data),
          {
            type: "video",
            mimeType: videoResponse.headers["content-type"]
          }
        );
        mediaIds.push(mediaId);
        console.log(`Uploaded mediaId: ${mediaId}`);
      }
    }

    // Construct tweet data
    const tweetData = {
      text: post.text,
      media_ids: mediaIds.length > 0 ? mediaIds : undefined
    };
    console.log("Tweet data:", tweetData);

    // Post tweet
    const response = await client.v2.tweet(tweetData);
    console.log("Tweet posted successfully:", response);

    return {
      success: true,
      postId: response.data.id,
      url: `https://x.com/${user.selectedXcom.username}/status/${response.data.id}`
    };
  } catch (error) {
    console.error("Error publishing to X.com:", error);
    return {
      status: "failed",
      error: error.message || "An unknown error occurred"
    };
  }
};

module.exports = { publishToInstagram, publishToFacebook, publishToXcom };
