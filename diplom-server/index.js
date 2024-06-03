import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import crypto from 'crypto';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { UserController, PostController, ApartmentController, ApplicationController, FavouriteController } from './controllers/index.js';

mongoose
  .connect("mongodb+srv://admin:admin@cluster0.wkwc1ku.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const extension = file.originalname.split('.').pop();
    cb(null, `${randomName}.${extension}`);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.patch('/user/me', checkAuth, UserController.updateUser);
app.delete('/users/:id', checkAuth, UserController.remove);
app.patch('/users/:id/role', checkAuth, UserController.changeRole);
app.patch('/users/:id/password', checkAuth, UserController.changePassword);
app.get('/users-list', UserController.getAll);

app.post('/apartments', checkAuth, ApartmentController.create);
app.get('/apartments', ApartmentController.getAll);
app.delete('/apartments/:id', checkAuth, ApartmentController.remove);
app.patch('/apartments', checkAuth, ApartmentController.update);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.filename}`,
  });
});

app.get('/tags', PostController.getLastTags);

app.get('/favourite', checkAuth, FavouriteController.getUserFavourites);
app.post('/favourite/:id', checkAuth, FavouriteController.create);
app.delete('/favourite/:id', checkAuth, FavouriteController.remove);

app.get('/posts', PostController.getAll);
app.get('/applications', ApplicationController.getAll);
app.get('/my-applications', checkAuth, ApplicationController.getUserApplications);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.post('/applications', checkAuth, ApplicationController.create);
app.patch('/applications', checkAuth, ApplicationController.changeStatus);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.delete('/applications/:id', checkAuth, ApplicationController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

app.listen(process.env.PORT || 3001, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
