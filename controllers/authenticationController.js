import User from "../models/userModel.js";
import catchApiErrors from "../utils/catchApiErrors.js";
import { filterResponse } from "../utils/commonUtils.js";
import jwt from "jsonwebtoken";
import AbstractApplicationError from "../utils/AbstractApplicationError.js";

const signUp = catchApiErrors(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  // Filter out the response
  const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
    expiresIn: process.env.SECRET_EXPIRY,
  });
  const finalResult = filterResponse(user, "name", "email", "_id");

  res.status(201).json({
    status: "success",
    token,
    data: finalResult,
  });
});

const signIn = catchApiErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!password || !email)
    return next(new AbstractApplicationError("Credentials not provided", 400));

  const user = await User.findOne({ email });

  if (!user || !(await user.validatePassword(password, user.password))) {
    return next(
      new AbstractApplicationError("Credentials are not valid.", 401)
    );
  }
  
  if(user.active !== true) {
    return next(new AbstractApplicationError("The user has been banned", 401))
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
    expiresIn: process.env.SECRET_EXPIRY,
  });

  res.status(201).json({
    status: "success",
    token,
  });
});

const authenticateUser = catchApiErrors(async (req, res, next) => {
  let token = "";
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AbstractApplicationError("Not authorized", 401));
  const verifyToken = await jwt.verify(token, process.env.SECRET_JWT); // 
  // payload
  // secret key
  const user = await User.findById(verifyToken.id);
  if (!user) {
    return next(new AbstractApplicationError("User does not exist", 401));
  }

  if (!user.tokenPasswordValidation(verifyToken.iat))
    return next(
      new AbstractApplicationError("Password has been changed. Relogin.", 401)
    );

  if(user.active !== true) {
    return next(new AbstractApplicationError("The user has been banned", 401))
  }

  req.user = user;
  next();
});

const authorizeUser = (...roles) => catchApiErrors(async (req, res, next) => {
  if(!roles.includes(req.user.role)) {
    return next(new AbstractApplicationError('No access to perform this task', 403))
  }
  // here ?
  console.log('Authorize user')
  next()
})

const updateUserRole = catchApiErrors(async (req, res, next) => {
  // req.user
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })
  res.status(201).json({
    status:'success',
    user
  })
})

const deleteUser = catchApiErrors(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: false }, {
    new: true
  })
  res.status(200).json({
    status: 'success'
  })
})

export { signUp, signIn, authenticateUser, authorizeUser, deleteUser, updateUserRole };
