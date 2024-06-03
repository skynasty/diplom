import FavouriteModel from '../models/Favourite.js'


export const getUserFavourites = async (req, res) => {
  try {
    const userId = req.userId
    const favourites = await FavouriteModel.find({user: userId}).exec();
    res.json(favourites);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить избранное',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const favouriteId = req.params.id;

    FavouriteModel.findOneAndDelete(
      {
        favourite: favouriteId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить избранное',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Избранное не найдено',
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
      message: 'Не удалось получить избранное',
    });
  }
};

export const create = async (req, res) => {
  try {
    const favourite = await FavouriteModel.find({user: req.userId, apartment: req.params.id});
    if(favourite.length) {
        res.status(500).json({
            message: 'Избранное уже существует'
        })
        return
    }
    const doc = new FavouriteModel({
      user: req.userId,
      apartment: req.params.id
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось добавить избранное',
    });
  }
};

