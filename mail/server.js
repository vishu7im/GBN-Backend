import nodemailer from "nodemailer";

import dotenv from "dotenv";
import { Accept } from "./Templates/Accept.js";
import { Reject } from "./Templates/Reject.js";
import { Otp } from "./Otp.js";

dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: 465, // secure
//   secure: true,
//   auth: {
//     user: process.env.SENDER_MAIL,
//     pass: process.env.MAIL_PWD,
//   },
// });

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.MAIL_PWD,
  },
});

export const ACCEPT = (email, name) => {
  const template = Accept(name);

  const mailOptions = {
    from: `"GBN Alumni" <${process.env.SENDER_MAIL}>`, // sender address
    to: email,
    subject: "Accept!",
    html: template,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return reject(error);
      } else {
        // do something useful
        return resolve(info);
      }
    });
  });
};
export const sentotp = (email, otp) => {
  const template = Otp(otp);

  const mailOptions = {
    from: `"GBN Alumni" <${process.env.SENDER_MAIL}>`, // sender address
    to: email,
    subject: "Otp for registration",
    html: template,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return reject(error);
      } else {
        // do something useful
        return resolve(info);
      }
    });
  });
};

export const REJECT = (email, remark, name) => {
  const template = Reject(name, remark);

  const mailOptions = {
    from: `"GBN Alumni" <${process.env.SENDER_MAIL}>`, // sender address
    to: email,
    subject: "Reject",
    html: template,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return reject(error);
      } else {
        // do something useful
        return resolve(info);
      }
    });
  });
};
