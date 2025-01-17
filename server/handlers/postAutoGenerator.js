const postGenerator = require("./PostGenerator");

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
    const generatedData = await postGenerator(companyDetails);
    const postContent = generatedData; // Extract the content field
    console.log({ autogen: postContent });
    generatedPosts.push({
      text: postContent.text,
      images: [`${postContent.image}`],
      status: "draft"
    });
  }

  return generatedPosts;
}

module.exports = postAutoGenerator;
