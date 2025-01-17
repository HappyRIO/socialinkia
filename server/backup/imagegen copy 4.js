const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { createCanvas } = require("canvas");
const fs = require("fs");

// Load environment variables
dotenv.config({ path: "../.env" });

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_API_KEY = process.env.GPT_API_KEY;

// Function to generate a custom background
function generateCustomBackground(
  outputFilePath,
  primaryColor = "#FF0043",
  secondaryColor = "#333",
  backgroundColor = "#1A1A1A"
) {
  const width = 800; // Image width
  const height = 630; // Image height
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background Color
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Add blurred gradient effect
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    50,
    width / 2,
    height / 2,
    width
  );
  gradient.addColorStop(0, `${primaryColor}88`); // Transparent primary color
  gradient.addColorStop(1, `${backgroundColor}`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw hexagon
  const drawHexagon = (x, y, size, color) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };
  drawHexagon(width / 2, height / 2 - 80, 100, primaryColor);

  // Add geometric shapes (stripes)
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(50, height - 150, width - 100, 30); // Bottom stripe

  // Add dashed lines
  ctx.strokeStyle = secondaryColor;
  ctx.setLineDash([10, 5]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(width - 50, 50);
  ctx.stroke();

  // Save the generated background
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputFilePath, buffer);
  console.log(`Custom background saved to ${outputFilePath}`);
}

// Function to generate an image with the text prompt
async function generateImage(prompt, outputFilePath) {
  generateCustomBackground(outputFilePath); // Generate custom background first

  const canvas = createCanvas(800, 630);
  const ctx = canvas.getContext("2d");

  // Load the background image
  const { Image } = require("canvas"); // Import Image correctly
  const backgroundBuffer = fs.readFileSync(outputFilePath);
  const background = new Image();
  background.src = backgroundBuffer;
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

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
