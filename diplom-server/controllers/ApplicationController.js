import { application } from "express";
import ApplicationModel from "../models/Application.js";

export const getAll = async (req, res) => {
    try {
      const applications = await ApplicationModel.find().populate('user').exec();
      res.json(applications);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить заявки',
      });
    }
  };

  export const getUserApplications = async (req, res) => {
    try {
      const userId = req.userId
      console.log(userId)
      const applications = await ApplicationModel.find({user: userId}).populate('user').exec();
      console.log(applications)
      res.json(applications);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить заявки пользователя',
      });
    }
  };

  export const create = async (req, res) => {
    try {
      const doc = new ApplicationModel({
        dateBegin: req.body.dateBegin,
        dateEnd: req.body.dateEnd,
        phone: req.body.phone,
        cost: req.body.cost,
        user: req.userId,
        apartment: req.body.apartmentId,
      });
  
      const application = await doc.save();
      const foundedApp = await ApplicationModel.findById({_id: application._id}).populate('user').exec();
      res.json(foundedApp);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось создать заявку',
      });
    }

  };

  export const changeStatus = async (req, res) => {
    try {
      const appId = req.body._id;
  
      await ApplicationModel.updateOne(
        {
          _id: appId,
        },
        {
          status: req.body.status
        },
      );
  
      res.json({
        _id: appId, 
        status: req.body.status
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось обновить заявку',
      });
    }
  };

  export const remove = async (req, res) => {
    try {
      const appId = req.params.id;
  
      ApplicationModel.findOneAndDelete(
        {
          _id: appId,
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Не удалось удалить заявку',
            });
          }
  
          if (!doc) {
            return res.status(404).json({
              message: 'Заявка не найдена',
            });
          }
  
          res.json({
            success: true,
          });
        },
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить заявки',
      });
    }
  };