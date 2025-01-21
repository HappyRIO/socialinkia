const { cloudinary, connectCloudinary } = require("../data/file");
const { Readable } = require("stream");

const uploadImagesToCloudinary = async (files) => {
  // connectCloudinary();
  console.log("processing images");
  const urls = [];
  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "automedia" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      Readable.from(file.buffer).pipe(stream);
    });
    urls.push(result);
  }
  return urls;
};

module.exports = uploadImagesToCloudinary;
