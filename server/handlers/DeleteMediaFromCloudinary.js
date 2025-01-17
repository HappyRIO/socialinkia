const { cloudinary } = require("../data/file");

/**
 * Deletes media files from Cloudinary based on provided URLs.
 * @param {string[]} mediaUrls - Array of media URLs to be deleted.
 */
async function deleteMediaFromCloudinary(mediaUrls) {
  try {
    for (const url of mediaUrls) {
      const publicId = url.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
      const resourceType = url.includes("/video/") ? "video" : "image"; // Determine resource type

      if (resourceType === "video") {
        console.log("Deleting video resource");
      }

      if (resourceType === "image") {
        console.log("Deleting image resource");
      }

      await cloudinary.uploader.destroy(`automedia/${publicId}`, {
        resource_type: resourceType
      });
    }
  } catch (error) {
    console.error("Error deleting media from Cloudinary:", error);
  }
}

module.exports = deleteMediaFromCloudinary;