const fetch = require("node-fetch");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// Load environment variables
dotenv.config({ path: "../.env" });

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_API_KEY = process.env.GPT_API_KEY;

// Function to pick a random background image from the folder
function getRandomBackground(folderPath) {
  const files = fs
    .readdirSync(folderPath)
    .filter((file) =>
      [".png", ".jpg", ".jpeg"].includes(path.extname(file).toLowerCase())
    );
  if (files.length === 0) {
    throw new Error("No background images found in the folder!");
  }
  const randomIndex = Math.floor(Math.random() * files.length);
  return path.join(folderPath, files[randomIndex]);
}

// Function to generate an image with the text prompt
async function generateImage(prompt, outputFilePath) {
  const backgroundFolder = "./backgroundimages";
  const randomBackgroundPath = getRandomBackground(backgroundFolder);

  const canvas = createCanvas(800, 630);
  const ctx = canvas.getContext("2d");

  // Load the random background image
  const background = await loadImage(randomBackgroundPath);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Add a slight blur effect to the background (simulate with semi-transparent overlay)
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text styling
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Center text
  const maxWidth = canvas.width - 100;
  const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  };

  const textX = canvas.width / 2;
  const textY = canvas.height / 2;
  wrapText(ctx, prompt, textX, textY, maxWidth, 50);

  // Save final image
  const finalBuffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputFilePath, finalBuffer);
  console.log(`Final image with text saved to ${outputFilePath}`);
}

// Function to generate a social media post
async function generatePost() {
  const companyDetails = {
    companyTradeName: "Metro Tech",
    businessSector: "IT Services",
    communication_style: "joke",
    communication_style_other: "geek, IT humor, sass jokes"
  };

  const response = await fetch(CHATGPT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHATGPT_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are the social media manager for ${companyDetails.companyTradeName}. Create a short and catchy post.`
        },
        {
          role: "user",
          content: `Create a ${companyDetails.communication_style}, super short and customer-centric post for
          Name: ${companyDetails.companyTradeName}
          Sector: ${companyDetails.businessSector}`
        }
      ]
    })
  });

  const rawData = await response.json();
  let messageContent = rawData.choices[0].message.content.trim();

  console.log({ messageContent });

  const outputFilePath = "./socialMediaPost.png";
  await generateImage(messageContent, outputFilePath);

  return messageContent;
}

generatePost().catch(console.error);
