import mongoose from 'mongoose';

const FavouriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        apartment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Apartment',
            required: true,
        },

    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Favourite', FavouriteSchema);
