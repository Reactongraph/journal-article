const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "secretKey", {
      expiresIn: "1h",
    });

    res.send({ message: "Login successful", token, data: user });
  } catch (err) {
    res.status(500).send({ error: "Failed to login", details: err });
  }
};

const signUp = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }
  try {
    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return res.status(409).send({ error: "Email already in use" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    };

    // Save the user to the database
    await User.create(newUser);

    res.send({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send({ error: "Failed to register user", details: err });
  }
};

module.exports = { login, signUp };
