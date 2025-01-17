const cron = require("node-cron");
const User = require("../model/User");
const postGenerator = require("./PostGenerator");

function TimeBasedPostGenerator() {
  console.log("starting cron job system for monthly post generation.");

  // Schedule the task to run every 1 day
  cron.schedule("0 0 1 * *", async () => {
    console.log("cron job system running");
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
            const generatedData = await postGenerator(companyDetails);
            const postContent = generatedData;
            console.log(`generating new monthly post for ${user?.email} `);
            const newPost = {
              text: postContent.text,
              platform: {
                all: false,
                gmb: false,
                insta: false,
                fbook: false
              },
              uploadDate: new Date().toISOString(),
              images: [`${postContent.image}`],
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
