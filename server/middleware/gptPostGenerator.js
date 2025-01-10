const fetch = require("node-fetch");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "../.env" });
const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_API_KEY = process.env.GPT_API_KEY;

// Function to call ChatGPT API
async function generatePost(companyDetails) {
  console.log({
    companyTradeName: companyDetails.companyTradeName,
    message: "currently generating posts"
  });

  // Function to call ChatGPT API
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
          content: `you are the social media manager for ${companyDetails.companyTradeName}, i want you to make a deep good research for ${companyDetails.companyTradeName}, if ${companyDetails.webPageUrl} is undefined just ignore it, if the webpage is defined go to the website and read through to understande the company
           and craft a good perfect post for their social media, including facebook, instagram, google my business. your post response should be suitable for all social media listed, just a single content.
           dont add any thing to the bigining of your responce, just responde with the post only, and always switch dynamics, nothing more nothingless let fire on`
        },
        {
          role: "user",
          content: `Create a ${companyDetails.communication_style}, super short and customer centric post content of max 20 words for 
 - Name: ${companyDetails.companyTradeName}
 - Sector: ${companyDetails.businessSector}
 - Slogan: ${companyDetails.motto_field}
 - Highlight: ${companyDetails.highlight}
 - Business defination: ${companyDetails.business_definition}
 - Extra: ${companyDetails.communication_style_other}`
        }
      ]
    })
  });

  const rawData = await response.json();
  let messageContent = rawData.choices[0].message.content;

  // Trim any unwanted quotes from the start and end of the messageContent
  if (
    typeof messageContent === "string" &&
    messageContent.startsWith('"') &&
    messageContent.endsWith('"')
  ) {
    messageContent = messageContent.slice(1, -1);
  }

  // Attempt to parse the JSON output
  try {
    return messageContent;
  } catch (err) {
    console.error("Invalid JSON received from OpenAI:", err);
    return {
      caption: "Failed to generate post. Please try again.",
      error: err
    };
  }
}

module.exports = generatePost;
