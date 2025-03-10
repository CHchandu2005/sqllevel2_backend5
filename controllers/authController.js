const jwt = require('jsonwebtoken');
require('dotenv').config()
const User=require('../model/User')
const SECRET_KEY = process.env.SECRET_KEY; 


const adminlogin = async (req, res) => {
  try {
      console.log("Request Body:", req.body);

      const { userID, name, password, mobile } = req.body;

      // Validate required fields
      if (!userID || !name || !mobile || !password) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      console.log("Received Password:", password);
      console.log("Stored Password & Secret Key:", process.env.password, process.env.SECRET_KEY);

      // Check if the password matches the environment password
      if (password !== process.env.password) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if the user with the given teckziteid already exists
      const existingUser = await User.findOne({ teckziteid: userID });

      if (existingUser) {
          // If user exists and isLogin is true, respond with "You have already attempted the quiz."
          if (existingUser.isLogin) {
              return res.status(403).json({ message: "You have already attempted the quiz." });
          } else {
              // If user exists but isLogin is false, update the user's details
              existingUser.name = name;
              existingUser.mobilenumber = mobile;
              existingUser.isLogin = true; // Set isLogin to true
              await existingUser.save();
              console.log("User Updated:", existingUser);

              // Generate JWT token
              const payload = {
                  id: userID,
                  iat: Math.floor(Date.now() / 1000),
                  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60), // 60 seconds * 60 minutes = 1 hour              };
              }
              if (!process.env.SECRET_KEY) {
                  throw new Error("SECRET_KEY is undefined");
              }

              const token = jwt.sign(payload, process.env.SECRET_KEY);
              console.log("JWT Token:", token);

              return res.status(200).json({ token, user: existingUser });
          }
      } else {
          // If user does not exist, create a new user
          const newUser = new User({
              teckziteid: userID,
              mobilenumber: mobile,
              name: name,
              isLogin: true, // Set isLogin to true for the new user
          });

          const logineduser = await newUser.save();
          console.log("User Saved:", logineduser);

          // Generate JWT token
          const payload = {
            id: userID,
            iat: Math.floor(Date.now() / 1000), 
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
        };
        

          if (!process.env.SECRET_KEY) {
              throw new Error("SECRET_KEY is undefined");
          }

          const token = jwt.sign(payload, process.env.SECRET_KEY);
          console.log("JWT Token:", token);

          return res.status(200).json({ token, user: logineduser });
      }
  } catch (err) {
      console.error("Error in adminlogin:", err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


const verify = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    return res.status(200).json({
      message: "Token is valid",
      user: { teckziteid: decoded.id, name: decoded.name, mobile: decoded.mobile },
    });
  });
};
module.exports = {adminlogin,verify};