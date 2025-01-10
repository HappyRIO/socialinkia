const gptPostGenerator = require("./gptPostGenerator");

async function postAutoGenerator({ mainUser, updatedUser }) {
  let iterations = 0;
  const generatedPosts = [];

  if (mainUser.subscription.plan === "premium") {
    iterations = 30;
  } else if (mainUser.subscription.plan === "standard") {
    iterations = 20;
  } else if (mainUser.subscription.plan === "basic") {
    iterations = 7;
  }

  for (let i = 0; i < iterations; i++) {
    const companyDetails = updatedUser.companyDetails;
    const generatedData = await gptPostGenerator(companyDetails);
    const postContent = generatedData; // Extract the content field
    console.log({ autogen: postContent });
    generatedPosts.push({ text: postContent, status: "draft" });
  }

  return generatedPosts;
}

module.exports = postAutoGenerator;
