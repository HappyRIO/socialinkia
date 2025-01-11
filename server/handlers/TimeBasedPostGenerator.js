const cron = require("node-cron");
const gptPostGenerator = require("../middleware/gptPostGenerator");
const User = require("../model/User");

function TimeBasedPostGenerator() {
  console.log({
    AutopostGenerator: "starting cron job system for testing every 3 minutes..."
  });

  // Schedule the task to run every 3 minutes
  cron.schedule("0 0 1 * *", async () => {
    console.log({
      AutopostGenerator:
        "cron job system running every 3 minutes for testing..."
    });
    try {
      const users = await User.find(); // Retrieve all users from the database

      for (const user of users) {
        const now = new Date();
        const lastGenerationDate =
          user.lastPostGenerationDate || user.createdAt;
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

        // Check if a month has passed since the last post generation
        if (lastGenerationDate < oneMonthAgo) {
          let iterations = 0;

          if (user.subscription.plan === "premium") {
            iterations = 30;
          } else if (user.subscription.plan === "standard") {
            iterations = 20;
          } else if (user.subscription.plan === "basic") {
            iterations = 7;
          }

          for (let i = 0; i < iterations; i++) {
            const companyDetails = user.companyDetails;
            const generatedData = await gptPostGenerator(companyDetails);
            const postContent = generatedData;
            console.log(`generating new monthly post for ${user?.email} `);
            const newPost = {
              text: postContent,
              platform: {
                all: false,
                gmb: false,
                insta: false,
                fbook: false
              },
              uploadDate: new Date().toISOString(),
              images: [],
              videos: [],
              status: "draft"
            };

            user.posts.push(newPost);
          }

          // Update the last post generation date
          user.lastPostGenerationDate = new Date();
          await user.save();
        }
      }
    } catch (error) {
      console.error("Error generating posts:", error);
    }
  });
}

module.exports = TimeBasedPostGenerator;
