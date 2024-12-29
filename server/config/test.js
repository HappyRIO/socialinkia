const fetch = require("node-fetch");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "../.env" });

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_API_KEY = process.env.GPT_API_KEY;

async function generatePost() {
  const companyDetails = {
    userName: "meta tech",
    logo: "https://res.cloudinary.com/dqmqbpaez/image/upload/v1735392905/automedia/uwwtaj6trmv4yij5q6bu.jpg",
    companyTradeName: "metro tech",
    businessSector: "IT Services",
    addressVisible: "NO",
    country: "",
    province: "",
    locality: "",
    postalCode: "",
    webPage: "YES",
    webPageUrl: "http://chidavid.netlify.app/",
    showContactInfo: "NO",
    contactInfo: "",
    photos: [
      "https://res.cloudinary.com/dqmqbpaez/image/upload/v1735392901/automedia/snbioawarrpxvxmqfzqx.jpg",
      "https://res.cloudinary.com/dqmqbpaez/image/upload/v1735392902/automedia/vrm1etxvmrs0zn4kjx4u.jpg",
      "https://res.cloudinary.com/dqmqbpaez/image/upload/v1735392903/automedia/z9nxwmdgv6xik5ifluva.jpg",
      "https://res.cloudinary.com/dqmqbpaez/image/upload/v1735392904/automedia/q8dqjgjfnqo2pbdybgk9.jpg"
    ],
    schedule: "never_close",
    sales_channels: "ecommerce_physical",
    motto: "have",
    motto_field: "lightning ⚡ fast",
    business_definition: ["Technology", "Innovation", "Creativity"],
    business_definition_other: "",
    highlight: "",
    star_product: "service",
    star_product_field: "web app development",
    features: "vastly fast and user friendly",
    add_products: "no",
    add_products_field: "",
    add_features: "",
    objectives: "visit_web_and_premises",
    exterior_photo: "",
    interior_photo: "",
    special_place_photo: "",
    staff_photo: "",
    area_of_influence: "international",
    customer_type: ["men", "companies"],
    age_range: ["46_55", "56_65", "25_35"],
    valuable_content: ["geeky_content"],
    valuable_content_other: "teschnology, geekfull, tech",
    communication_style: "joke",
    communication_style_other: "geek, it hummor, sass jokes",
    _id: {
      $oid: "6770019e80a971a2adb56ea5"
    }
  };

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
  if (messageContent.startsWith('"') && messageContent.endsWith('"')) {
    messageContent = messageContent.slice(1, -1);
  }

  console.log({ messageContent });
  return messageContent;
}

generatePost();