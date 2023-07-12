import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import User, { IUser, TCreatedUser } from '../models/User.model.js';
import Note from '../models/Note.model.js';

// @decd Get all users
// @route GET /users
// @access Private
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select('-password').lean();
    if (!users?.length) {
      return res.status(400).json({ message: 'No users found' });
    }
    res.json(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// @decd Create new user
// @route POST /users
// @access Private
export const createNewUser = async (
  req: Request<{}, {}, IUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, roles } = req.body;

    //confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
      return res.status(409).json({ message: 'Duplicate username' });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10); //salt

    const userObject = { username, password: hashedPassword, roles };

    //create and store new user
    const user = await User.create(userObject);

    if (user) {
      res.status(201).json({ message: `New user ${username} created` });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    next(error);
  }
};

// @decd Update a user
// @route PATCH /users
// @access Private
export const updateUser = async (
  req: Request<{}, {}, TCreatedUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, username, roles, active, password } = req.body;

    //confirm data
    if (
      !id ||
      !username ||
      !Array.isArray(roles) ||
      !roles.length ||
      typeof active !== 'boolean'
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: 'Duplicate username' });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
      //hash password
      user.password = await bcrypt.hash(password, 10); //salt
    }

    const updateUser = await user.save();

    res.json({ message: `${updateUser.username} updated` });
  } catch (error) {
    next(error);
  }
};

// @decd Delete a user
// @route DELETE /users
// @access Private
export const deleteUser = async (
  req: Request<{}, {}, Pick<TCreatedUser, 'id'>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const notes = await Note.find({ user: id }).lean().exec();

    if (notes?.length) {
      return res.status(400).json({ message: 'User has assigned notes' });
    }

    const result = await user.deleteOne();

    const reply = `Username ${result.username} with ID ${result._id} deleted`;

    res.json(reply);
  } catch (error) {
    next(error);
  }
};
