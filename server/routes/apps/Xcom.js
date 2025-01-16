const express = require("express");
const router = express.Router();
const { TwitterApi } = require("twitter-api-v2");
const isSessionValid = require("../../middleware/isSessionValid");
const User = require("../../model/User");

const clientId = process.env.X_CLIENT_ID;
const clientSecret = process.env.X_CLIENT_SECRET;
const redirectUri = process.env.X_REDIRECT_URL;

router.get("/auth/xcom", isSessionValid, (req, res) => {
  console.log("activating x connector");
  const client = new TwitterApi({
    clientId,
    clientSecret
  });

  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
    redirectUri,
    {
      scope: ["tweet.read", "tweet.write", "users.read", "offline.access"]
    }
  );

  console.log({ state: state });

  req.session.codeVerifier = codeVerifier; // Store codeVerifier for token exchange
  req.session.state = state; // Store state to validate during callback
  req.session.user = req.user;
  res.redirect(url);
});

router.get("/auth/xcom/callback", async (req, res) => {
  const { state, code } = req.query;

  if (!state || state !== req.session.state) {
    return res.status(400).send("Invalid state parameter");
  }

  const client = new TwitterApi({
    clientId,
    clientSecret
  });

  try {
    const {
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn
    } = await client.loginWithOAuth2({
      code,
      codeVerifier: req.session.codeVerifier,
      redirectUri
    });

    const userData = await loggedClient.v2.me();
    const user = req.session.user;
    if (!user) {
      res.status(404).json({
        message: "user not found"
      });
    }
    // Update the user document with selectedXcom details
    await User.findByIdAndUpdate(user._id, {
      selectedXcom: {
        id: userData.data.id,
        username: userData.data.username,
        accessToken,
        refreshToken,
        tokenExpiry: new Date(Date.now() + expiresIn * 1000)
      }
    });

    res.status(201).send(`
      <html>
        <body>
        <p>x.com connected</p>
          <script>
            window.close();
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error during callback:", error);
    res.status(500).send("Authentication failed");
  }
});

router.get("/", isSessionValid, async (req, res) => {
  const { accessToken } = req.user.selectedXcom;

  try {
    // Initialize the client with the user's access token
    const client = new TwitterApi(accessToken);

    // Fetch the user's tweets (timeline)
    const timeline = await client.v2.userTimeline(req.user.selectedXcom.id, {
      exclude: ["retweets", "replies"], // Optional: Exclude retweets and replies
      max_results: 10 // Optional: Limit the number of tweets returned
    });

    // Respond with the timeline data
    res.status(200).json(timeline.data);
  } catch (error) {
    console.error("Error fetching user timeline:", error);
    res.status(500).send("Failed to retrieve posts");
  }
});

router.post("/", isSessionValid, async (req, res) => {
  const { content } = req.body;
  const { accessToken } = req.user.selectedXcom;

  try {
    const client = new TwitterApi(accessToken);
    const tweet = await client.v2.tweet(content);
    res.status(201).json(tweet);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Failed to create post");
  }
});

router.get("/:id", isSessionValid, async (req, res) => {
  const { id } = req.params;
  const { accessToken } = req.user.selectedXcom;

  try {
    const client = new TwitterApi(accessToken);
    const tweet = await client.v2.singleTweet(id);
    res.status(200).json(tweet);
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).send("Failed to retrieve post");
  }
});

router.post("/analysis/:id", isSessionValid, async (req, res) => {
  const { id } = req.params;
  const { accessToken } = req.user.selectedXcom;

  try {
    const client = new TwitterApi(accessToken);
    const tweet = await client.v2.singleTweet(id);

    const analysis = {
      length: tweet.data.text.length,
      wordCount: tweet.data.text.split(" ").length,
      hasMentions: tweet.data.text.includes("@")
    };

    res.status(200).json({ tweet, analysis });
  } catch (error) {
    console.error("Error analyzing post:", error);
    res.status(500).send("Failed to analyze post");
  }
});

module.exports = router;
