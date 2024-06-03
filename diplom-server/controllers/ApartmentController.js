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

export const create = async (req, res) => {
  try {
    const doc = new ApartmentModel({
      rooms_count: req.body.rooms_count,
      square: req.body.square,
      city: req.body.city,
      street: req.body.street,
      house_number: req.body.house_number,
      description: req.body.description,
      price: req.body.price,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
    });

    const apartment = await doc.save();

    res.json(apartment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать помещение',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const apId = req.params.id;

    ApartmentModel.findOneAndDelete(
      {
        _id: apId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить помещение',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Помещение не найдено',
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
      message: 'Не удалось получить помещение',
    });
  }
};

export const update = async (req, res) => {
  try {
    const apId = req.body._id;

    await ApartmentModel.updateOne(
      {
        _id: apId,
      },
      {
        rooms_count: req.body.rooms_count,
        square: req.body.square,
        city: req.body.city,
        street: req.body.street,
        house_number: req.body.house_number,
        description: req.body.description,
        price: req.body.price,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
      },
    );

    res.json(req.body);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить помещение',
    });
  }
};