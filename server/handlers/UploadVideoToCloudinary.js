const { cloudinary } = require("../data/file");
const { Readable } = require("stream");

const uploadVideosToCloudinary = async (files) => {
  console.log("Processing videos...");
  const urls = [];

  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "automedia/videos", resource_type: "video" }, // Specify the folder path
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );

      // Stream the file buffer to Cloudinary
      Readable.from(file.buffer).pipe(stream);
    });

    urls.push(result);
  }

  return urls;
};

module.exports = uploadVideosToCloudinary;
