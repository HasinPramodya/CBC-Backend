import User from "../model/user.model.js";
import Contact from "../model/contact.model.js";
import bcrypt, { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import { OTP } from "../model/otp.model.js";

dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "pramodyahasin@gmail.com",
    pass: "haui djhq agds arxz",
  }
})

export async function createUser(req, res) {
  if (req.body.userType == "admin") {
    if (req.user == null) {
      res.status(401).json({
        message: "plesae Login as an Admin",
      });
      return;
    }
    if (req.user.userType !== "admin") {
      res.status(403).json({
        message: "You are not authoroized to add admin account",
      });
      return;
    }
  }
  if (!req.body.password) {
    res.status(400).json({
      message: "Password is required",
    });
    return;
  }
  const hashPassword = bcrypt.hashSync(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userType: req.body.userType,
    password: hashPassword,
    phoneNo: req.body.phoneNo,
    isEmailverified: req.body.isEmailverified,
  });
  try {
    await user.save();
    res.status(201).json({
      message: "User Created Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "User can not Created Successfully",
    });
  }
}

export async function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      email: email,
    });
    console.log(user);
    if (user !== null) {
      if (bcrypt.compareSync(password, user.password)) {
        const userData = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          phoneNo: user.phoneNo,
          isEmailverified: user.isEmailverified,
        };

        const token = jwt.sign(userData, process.env.JWT_KEY);
        console.log(token);
        res.status(200).json({
          message: "Login Successfully",
          your_token: token,
          user: userData,
        });
      } else {
        res.status(401).json({
          message: "Invalid Emai or Password",
        });
      }
    } else {
      res.status(401).json({
        message: "Invalid email",
      });
    }
  } catch (err) {
    console.log("Invalid Login");
    res.status(500).json({ message: "Server error" });
  }
}

export async function googleLogin(req, res) {
  const accessToken = req.body.accessToken;

  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);
    const user = await User.findOne({
      email: response.data.email,
    });

    if (user == null) {
      const newuser = new User({
        email: response.data.email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        password: accessToken,
        isEmailverified: true,
      });

      await newuser.save();
      const userData = {
        email: response.data.email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        userType: "customer",
        phoneNo: "Not given",
        isEmailverified: true,
      };
      const token = jwt.sign(userData, process.env.JWT_KEY);
      console.log(token);
      res.status(200).json({
        message: "Login Successfully",
        your_token: token,
        user: userData,
      });
    } else {
      const userData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        phoneNo: user.phoneNo,
        isEmailverified: user.isEmailverified,
      };

      const token = jwt.sign(userData, process.env.JWT_KEY);
      console.log(token);
      res.status(200).json({
        message: "Login Successfully",
        your_token: token,
        user: userData,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Google Login failed",
    });
  }
}

export function getCurrentUser(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "please Login to the system",
    });
    return;
  }
  res.status(200).json({
    user: req.user,
  });
}

export async function getAllUsers(req, res) {
  if (req.user == null) {
    res.status(401).json()({
      message: "plesae Login as an Admin",
    });
    return;
  }
  if (req.user.userType !== "admin") {
    res.status(403).json()({
      message: "You are not authoroized to add admin account",
    });
    return;
  }

  try {
    const users = await User.find()
    res.status(200).json({
      users: users
    })
  } catch (err) {
    res.status(500).json({
      message: "Failed to get all users",
    });
  }

}

export async function createContact(req, res) {

  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    phoneNo: req.body.phone,
    address: req.body.address,
    comment: req.body.comment,
  });

  try {
    await contact.save();
    res.status(201).json({
      message: "Contact Created Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Contact can not Created Successfully",
    });
  }
}

export async function sendOTP(req, res) {
  const email = req.body.email;
  const otp = Math.floor(Math.random() * 1000000);

  const message = {
    from: "pramodyahasin@gmail.com",
    to: email,
    subject: "otp for email verification",
    text: "Your OTP for email verification is :" + otp,
  };

  const newOtp = new OTP(
    {
      email: email,
      otp: otp,
    }
  );
  try {
    await newOtp.save();
    console.log("OTP saved successfully");
  } catch (err) {
    console.log("Failed to save OTP", err);
  }

  transport.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: "Failed to send OTP",
      });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({
        message: "OTP sent successfully",
        otp: otp, // In a real application, you would not send the OTP back like this
      });

    }
  });
}

export async function changePassword(req, res) {
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const otp = req.body.otp

  try {
    const lastOtp = await OTP.findOne(
      { email: email }
    ).sort({ createdAt: -1 })
    if (lastOtp == null) {
      res.status(400).json({
        message: "Invalid OTP",
      });
      return;
    }
    if (lastOtp.otp != otp) {
      res.status(400).json({
        message: "Invalid OTP",
      });
      return;
    }
    if (!newPassword) {
      res.status(400).json({
        message: "New password is required",
      });
      return;
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await User.updateOne(
      { email: email },
      { password: hashedPassword }
    )
    await OTP.deleteMany({
      email: email
    })
    res.json({
      message: "Password changed successfully"
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to find OTP & change password",
    });
    return;
  }


}


