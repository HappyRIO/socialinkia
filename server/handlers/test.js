const fetch = require("node-fetch");
const dotenv = require("dotenv");
const uploadImagesToCloudinary = require("./UploadImageToCloudinary");

dotenv.config({ path: "../.env" });

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_API_KEY = process.env.GPT_API_KEY;
const PEXELS_API_URL = "https://api.pexels.com/v1/search";
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

console.log({
  PEXELS_API_KEY: PEXELS_API_KEY,
  CHATGPT_API_KEY: CHATGPT_API_KEY,
});

// Function to fetch an image from Pexels API
async function getPexelsImage(query) {
  const response = await fetch(
    `${PEXELS_API_URL}?query=${encodeURIComponent(query)}&per_page=15`,
    {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.photos || data.photos.length === 0) {
    throw new Error("No images found on Pexels for the given query.");
  }

  // Choose a random image from the results
  const randomIndex = Math.floor(Math.random() * data.photos.length);
  console.log({ pexels_image: data.photos[randomIndex].src.original });
  return data.photos[randomIndex].src.original;
}

// Function to generate a social media post
async function postGenerator(companyDetails) {
  const response = await fetch(CHATGPT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHATGPT_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are the social media manager for ${companyDetails.companyTradeName}. Create a short and catchy post.`,
        },
        {
          role: "user",
          content: `Create a ${companyDetails.communication_style}, super short and customer-centric post for
          Name: ${companyDetails.companyTradeName}
          Sector: ${companyDetails.businessSector}`,
        },
      ],
    }),
  });

  const rawData = await response.json();
  let messageContent = rawData?.choices[0]?.message?.content?.trim();
  messageContent = messageContent?.replace(/^['"]+|['"]+$/g, "").trim();

  console.log({ messageContent: messageContent });

  // Fetch image from Pexels API based on the prompt content
  const imageUrl = await getPexelsImage(messageContent);

  // Download the image from Pexels and upload it to Cloudinary
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.buffer();

  const cloudinaryUrl = await uploadImagesToCloudinary([
    { buffer: imageBuffer },
  ]);

  const generatedPost = {
    text: messageContent,
    image: cloudinaryUrl,
  };

  console.log(generatedPost);
  return generatedPost;
}

const companyDetails = {
  companyTradeName: "metro tesh",
  communication_style: "joke",
  businessSector: "IT solution",
};

postGenerator(companyDetails);
// module.exports = postGenerator;
