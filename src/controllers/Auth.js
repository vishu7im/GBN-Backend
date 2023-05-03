import { TempUser, User } from "../DB/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sentotp } from "../mail/server.js";

export const signup = async (req, res) => {
  // Extract user input
  const {
    name,
    email,
    password,
    rollNo,
    batch,
    profession,
    profile,
    proof,
    linkdln,
    facebook,
    twitter,
    about,
  } = req.body;
  let Tprofile = profile;
  if (
    !name ||
    !email ||
    !password ||
    !rollNo ||
    !proof ||
    !batch ||
    !profession
  ) {
    res.status(404).json({ msg: "invalid signature " });
  }
  if (!Tprofile) {
    Tprofile =
      "https://cdn-icons-png.flaticon.com/512/727/727399.png?w=740&t=st=1681474245~exp=1681474845~hmac=09ffb722f7fca5d0a9bfcbf94f2882745077de12a51525b993a7f35aadc4f7ad";
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(401).json({ error: "User already found" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 2);

  // Create a new user object
  const newUser = new TempUser({
    name,
    email,
    password: hashedPassword,
    rollNo,
    batch,
    profession,
    profile: Tprofile,
    proof,
    linkdln,
    facebook,
    twitter,
    about,
  });
  try {
    // Save the user to the database
    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: "wait for institute approvel", user: savedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    // Extract user input
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Compare the password hash
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Passwords match, create and send a token
    const token = jwt.sign({ userId: user._id }, process.env.PrivetKey, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const otpsent = async (req, res) => {
  const { email } = req.body;
  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  const token = jwt.sign({ email: email, otp: otp }, process.env.PrivetKey, {
    expiresIn: "300s",
  });
  await sentotp(email, otp);
  res.status(200).json({ msg: "otp sent", token: token });
};

export const validate = async (req, res) => {
  const { otp, email } = req.body;
  const { token } = req.headers;

  try {
    const data = await jwt.verify(token, process.env.PrivetKey);

    if (parseInt(data.otp) === parseInt(otp) && data.email === email) {
      const token = jwt.sign(
        { email: email, validation: true },
        process.env.PrivetKey,
        {
          expiresIn: "300s",
        }
      );
      res.status(200).json({ msg: "otp match ", token: token });
    } else {
      res.status(500).json({ msg: "otp not match" });
    }
  } catch (error) {
    res.status(500).json({ msg: "otp not match" });
  }
};

export const exist = async (req, res) => {
  const { email } = req.body;
  try {
    const permanent = await User.findOne({ email: email });
    const temp = await TempUser.findOne({ email: email });

    if (permanent || temp) {
      res.status(404).json({ msg: "user exist" });
      return;
    } else {
      res.status(200).json({ msg: "user not exist" });
      return;
    }
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};
