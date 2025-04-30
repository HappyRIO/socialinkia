const fetch = require("node-fetch");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// Load environment variables
dotenv.config();

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_API_KEY = process.env.GPT_API_KEY;

// Ensure output directories exist
const outputDir = path.join(__dirname, "../images/output");
const textDir = path.join(outputDir, "text");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(textDir)) {
  fs.mkdirSync(textDir, { recursive: true });
}

// Function to pick a random background image from the folder
function getRandomBackground(folderPath) {
  const files = fs
    .readdirSync(folderPath)
    .filter((file) =>
      [".png", ".jpg", ".jpeg", ".webp"].includes(
        path.extname(file).toLowerCase()
      )
    );
  if (files.length === 0) {
    throw new Error("No background images found in the folder!");
  }
  const randomIndex = Math.floor(Math.random() * files.length);
  return path.join(folderPath, files[randomIndex]);
}

// Function to detect the dominant background color
async function getDominantColor(imagePath) {
  const background = await loadImage(imagePath);
  const canvas = createCanvas(background.width, background.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  let r = 0,
    g = 0,
    b = 0,
    count = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    r += pixels[i]; // Red
    g += pixels[i + 1]; // Green
    b += pixels[i + 2]; // Blue
    count++;
  }

  // Average color
  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);

  return { r, g, b };
}

// Function to generate an image with the text prompt
async function generateImage(prompt, index) {
  const backgroundFolder = path.join(__dirname, "../images/backgroundimages");
  const randomBackgroundPath = getRandomBackground(backgroundFolder);

  const dominantColor = await getDominantColor(randomBackgroundPath);
  const canvas = createCanvas(800, 630);
  const ctx = canvas.getContext("2d");

  // Load the random background image
  const background = await loadImage(randomBackgroundPath);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Add a slight blur effect to the background (simulate with semi-transparent overlay)
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calculate contrast color based on background dominant color
  const isDark =
    dominantColor.r * 0.299 +
      dominantColor.g * 0.587 +
      dominantColor.b * 0.114 <
    186;
  ctx.fillStyle = isDark ? "#FFFFFF" : "#000000"; // White for dark backgrounds, black for light backgrounds

  // Text styling
  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Wrap text function with vertical centering adjustment
  const maxWidth = canvas.width - 100;
  const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    let lines = [];
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line); // push the last line

    // Calculate total height of the wrapped text block
    const totalTextHeight = lines.length * lineHeight;

    // Calculate starting y position for vertical centering
    let startY = (canvas.height - totalTextHeight) / 2;

    // Draw each line
    lines.forEach((line, index) => {
      context.fillText(line, x, startY + index * lineHeight);
    });
  };

  const textX = canvas.width / 2;
  const textY = canvas.height / 2;
  wrapText(ctx, prompt, textX, textY, maxWidth, 50);

  const outputPath = path.join(outputDir, `image_${index + 1}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
}

// Function to generate a social media post
async function postGenerator(index) {
  try {
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
            content: `You are the social media voice of @davidchidev — a developer who shares funny, techie, and futuristic content. Keep it smart, developer-friendly, and focused on value. Topics include JavaScript, web development, Web3, APIs, programming, cybersecurity, and Linux. No marketing fluff. Just entertaining and insightful content for devs.`,
          },
          {
            role: "user",
            content: `Write a short, witty, and valuable dev-focused post. Prioritize relevance over self-promotion.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const rawData = await response.json();

    // Log the raw response for debugging
    console.log(`Response for post ${index + 1}:`, rawData);

    if (!rawData.choices || rawData.choices.length === 0) {
      throw new Error("No choices returned in the API response.");
    }

    let messageContent = rawData.choices[0].message.content.trim();
    // Remove any unnecessary double or single quotes at the beginning and end of the string
    messageContent = messageContent.replace(/^["']+|["']+$/g, "").trim();

    const imagePath = await generateImage(messageContent, index);

    const textPath = path.join(textDir, `text_${index + 1}.txt`);
    fs.writeFileSync(textPath, messageContent);

    console.log(`Generated post ${index + 1}:`);
    console.log(`Text saved to: ${textPath}`);
    console.log(`Image saved to: ${imagePath}`);
  } catch (error) {
    console.error(`Error generating post ${index + 1}:`, error.message);
  }
}

// Run the generator 30 times
(async () => {
  for (let i = 0; i < 30; i++) {
    try {
      await postGenerator(i);
    } catch (error) {
      console.error(`Error generating post ${i + 1}:`, error);
    }
  }
})();
