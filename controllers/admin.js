import { TempUser, Admin, User } from "../DB/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCEPT, REJECT } from "../mail/server.js";

// admin login
export const Adminlogin = async (req, res) => {
  try {
    // Extract user input
    const { email, password } = req.body;

    // Check if user exists
    const user = await Admin.findOne({ username: email });

    if (!user) {
      return res.status(401).json({ error: "unauthorized" });
    }
    // Compare the password hash
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "unauthorized" });
    }

    // Passwords match, create and send a token
    const token = jwt.sign(
      { userId: user._id, admin: true },
      process.env.PrivetKey
    );
    res.status(200).json({ message: "Admin Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// fetch temp user

export const getUser = async (req, res) => {
  try {
    const data = await TempUser.find();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  UserResponse

export const UserResponse = async (req, res) => {
  const { email, flage, remark } = req.body;

  if (!email || !flage) {
    res.status(400).json({ Err: "invalid signature " });
    return;
  }
  // ensure user exist or not
  try {
    let data = await TempUser.findOne({ email });
    // eslint-disable-next-line
    if (!data) {
      res.status(400).json({ Err: "invalid signature " });
      return;
    }
    let username = data.name;

    if (flage === "Accept") {
      // accept
      const {
        name,
        rollNo,
        batch,
        profession,
        profile,
        proof,
        linkdln,
        facebook,
        twitter,
        email,
        password,
        about,
      } = data;

      const newuser = new User({
        name,
        rollNo,
        batch,
        profession,
        profile,
        proof,
        linkdln,
        facebook,
        twitter,
        email,
        password,
        about,
      });
      await newuser.save();
      await TempUser.deleteOne({ email: email });

      // sent mail for accept
      await ACCEPT(email, name);
      res.status(200).json({ msg: "user Accept " });
      return;
    } else {
      // reject
      await REJECT(email, remark, username);
      await TempUser.deleteOne({ email: email });
      // sent mail for rejection
      res.status(200).json({ msg: "user rejected " });
      return;
    }

    // accept reject
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const fetch = async (req, res) => {
  try {
    const data = await User.find();

    const shuffled = shuffle(data);
    const newArray = shuffled.slice();
    res.status(200).json({ data: newArray });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const fetchhomeuser = async (req, res) => {
  try {
    const data = await User.find();

    const shuffled = shuffle(data);
    const newArray = shuffled.slice(0, 5);
    res.status(200).json({ data: newArray });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getoneuser = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await User.findOne({ _id: id });

    if (!data) {
      res.status(400).json({ err: "not found" });
      return;
    }
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};

// for insterting new admin
export const NewAdmin = async (req, res) => {
  const { username, email, pwd } = req.body;

  if (!username || !email || !pwd) {
    res.status(200).json({ err: "invalid signature " });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(pwd, 2);
    const newUser = new Admin({
      username,
      email,
      password: hashedPassword,
      flag: true,
    });
    await newUser.save();
    res.status(200).json({ msg: "Admin Created " });
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};

// const temp = async () => {
//   let arr = [
//     {
//       name: "vishal",
//       email: "vishalmunday1234@gmail.com",
//       password: "rnfjksdljdbhjw",
//       rollNo: "210090800122",
//       batch: "2012-2015",
//       profession: "web developer",
//       linkedin: "www.linkedin.com/in/vishal",
//       facebook: "www.facebook.com/vishalmunday",
//       twitter: "www.twitter.com/vishalmunday",
//       about: "My name is Vishal and I am a web developer from India.",
//     },
//     {
//       name: "John Doe",
//       email: "johndoe1234@gmail.com",
//       password: "password123",
//       rollNo: "210090800123",
//       batch: "2013-2016",
//       profession: "software engineer",
//       linkedin: "www.linkedin.com/in/johndoe",
//       facebook: "www.facebook.com/johndoe",
//       twitter: "www.twitter.com/johndoe",
//       about: "I am a software engineer who loves to code and solve problems.",
//     },
//     {
//       name: "Jane Smith",
//       email: "janesmith1234@gmail.com",
//       password: "password456",
//       rollNo: "210090800124",
//       batch: "2014-2017",
//       profession: "graphic designer",
//       linkedin: "www.linkedin.com/in/janesmith",
//       facebook: "www.facebook.com/janesmith",
//       twitter: "www.twitter.com/janesmith",
//       about:
//         "I am a graphic designer with a passion for creating beautiful and functional designs.",
//     },
//     {
//       name: "Mark Johnson",
//       email: "markjohnson1234@gmail.com",
//       password: "password789",
//       rollNo: "210090800125",
//       batch: "2015-2018",
//       profession: "data analyst",
//       linkedin: "www.linkedin.com/in/markjohnson",
//       facebook: "www.facebook.com/markjohnson",
//       twitter: "www.twitter.com/markjohnson",
//       about:
//         "I am a data analyst with experience in analyzing large datasets and providing insights.",
//     },
//     {
//       name: "Sarah Lee",
//       email: "sarahlee1234@gmail.com",
//       password: "passwordabc",
//       rollNo: "210090800126",
//       batch: "2016-2019",
//       profession: "product manager",
//       linkedin: "www.linkedin.com/in/sarahlee",
//       facebook: "www.facebook.com/sarahlee",
//       twitter: "www.twitter.com/sarahlee",
//       about:
//         "I am a product manager with a passion for building products that solve customer problems.",
//     },
//     {
//       name: "David Kim",
//       email: "davidkim1234@gmail.com",
//       password: "passworddef",
//       rollNo: "210090800127",
//       batch: "2017-2020",
//       profession: "front-end developer",
//       linkedin: "www.linkedin.com/in/davidkim",
//       facebook: "www.facebook.com/davidkim",
//       twitter: "www.twitter.com/davidkim",
//       about:
//         "I am a front-end developer with experience in building responsive and user-friendly web applications.",
//     },
//     {
//       name: "Jennifer Park",
//       email: "jenniferpark1234@gmail.com",
//       password: "passwordghi",
//       rollNo: "210090800128",
//       batch: "2018-2021",
//       profession: "UX designer",
//       linkedin: "www.linkedin.com/in/vishal",
//       facebook: "www.facebook.com/vishalmunday",
//       twitter: "www.twitter.com/vishalmunday",
//       about: "My name is Vishal and I am a web developer from India.",
//     },
//   ];

//   for (let i = 0; i < arr.length; i++) {
//     let profile =
//       "https://cdn-icons-png.flaticon.com/512/727/727399.png?w=740&t=st=1681474245~exp=1681474845~hmac=09ffb722f7fca5d0a9bfcbf94f2882745077de12a51525b993a7f35aadc4f7ad";
//     let proof = "ff";
//     const {
//       name,
//       rollNo,
//       batch,
//       profession,

//       linkdln,
//       facebook,
//       twitter,
//       email,
//       password,
//       about,
//     } = arr[i];

//     let data = new User({
//       name,
//       rollNo,
//       batch,
//       profession,
//       proof,
//       linkdln,
//       facebook,
//       twitter,
//       email,
//       password,
//       about,
//       profile,
//     });

//     await data.save();
//     console.log(`entry no ${i}`);
//   }
// };
