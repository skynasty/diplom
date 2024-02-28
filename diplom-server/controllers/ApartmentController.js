import ApartmentModel from "../models/Apartment.js";

export const getAll = async (req, res) => {
    try {
      const apartments = await ApartmentModel.find().exec();
      res.json(apartments);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить квартиры',
      });
    }
  };