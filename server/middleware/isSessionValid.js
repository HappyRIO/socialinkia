const User = require("../model/User");

// Check if session token is valid
const isSessionValid = (req, res, next) => {
  const { sessionToken } = req.cookies;

  if (!sessionToken) {
    console.log("No session token provided");
    return res.status(401).json({ error: "No session token provided." });
  }

  User.findOne({ sessionToken })
    .then((user) => {
      if (!user) {
        console.log("Invalid session token.");
        return res.status(401).json({ error: "Invalid session token." });
      }

      const expirationTime = new Date(user.sessionExpiresAt);
      const currentTime = new Date();
      if (expirationTime <= currentTime) {
        return res.status(401).json({ error: "Session expired." });
      }

      // Extend session expiration time by 1 hour
      const newExpirationTime = new Date(currentTime.getTime() + 60 * 60000);
      user.sessionExpiresAt = newExpirationTime;

      // Save the updated user session expiration time
      user
        .save()
        .then(() => {
          console.log("Session expiration time extended by 1 hour.");
          req.user = user;
          next();
        })
        .catch((error) => {
          console.error("Error updating session expiration time:", error);
          res.status(500).json({ error: "Server error" });
        });
    })
    .catch((error) => {
      console.error("Error checking session validity:", error);
      res.status(500).json({ error: "Server error" });
    });
};

module.exports = isSessionValid;
