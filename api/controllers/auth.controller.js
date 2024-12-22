import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        const userExists = await User.findOne({ username: req.body.username });
if (userExists) {
    return res.status(400).json({ message: 'Username already taken' });
}

      console.log("Request body:", req.body); // Debug request data
      const hash = bcrypt.hashSync(req.body.password, 5);
     // console.log("Hashed password:", hash); // Debug hashed password
  
      const newUser = new User({
        ...req.body,
        password: hash,
      });
  
      await newUser.save();
      console.log("User saved successfully."); // Debug successful save
      res.status(201).send("User has been created.");
    } catch (err) {
      console.error("Error during registration:", err); // Debug errors
      next(err);
    }
  };
  
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};