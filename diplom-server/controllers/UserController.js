import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

import ApplicationModel from "../models/Application.js";
import FavouriteModel from "../models/Favourite.js";

export const register = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(404).json({
        msg: "Пользователь уже существует",
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      role: "user",
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        msg: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        msg: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Не удалось авторизоваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.replace("Bearer ", "")
      : null;
    console.log(token);
    if (!token) {
      return res.status(404).json({
        message: "token не найден",
      });
    }
    const userId = jwt.verify(token, "secret123");
    if (!userId) {
      return res.status(404).json({
        message: "id пользователя не найден",
      });
    }
    const user = await UserModel.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.replace("Bearer ", "")
      : null;
    console.log(token);
    if (!token) {
      return res.status(404).json({
        message: "token не найден",
      });
    }
    const userId = jwt.verify(token, "secret123");
    if (!userId) {
      return res.status(404).json({
        message: "id пользователя не найден",
      });
    }
    const user = await UserModel.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    const data = {
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    };
    await UserModel.updateOne(
      {
        _id: userId,
      },
      data
    );
    res.status(200).json({
      message: "Успешно!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await UserModel.find().exec();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пользователей",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    await ApplicationModel.deleteMany({ user: userId });
    await FavouriteModel.deleteMany({ user: userId });
    UserModel.deleteOne(
      {
        _id: userId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось удалить пользователя",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Пользователь не найден",
          });
        }

        return res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось получить пользователя",
    });
  }
};

export const changeRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const role = req.body.role
    if (!userId || !role) {
      res.status(500).json({
        message: "Не удалось получить пользователя или роль",
      });
    }
    await UserModel.findOneAndUpdate({_id: userId}, {role: role}).exec();
    res.status(200).json({message: 'Успех'});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пользователя",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const password = req.body.password
    if (!userId) {
      res.status(500).json({
        message: "Не удалось получить пользователя",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await UserModel.findOneAndUpdate({_id: userId}, {passwordHash: hash}).exec();
    res.status(200).json({message: 'Успех'});
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось изменить пароль",
    });
  }
};