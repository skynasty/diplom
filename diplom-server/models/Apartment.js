import mongoose from 'mongoose';

const ApartmentSchema = new mongoose.Schema(
    {
        rooms_count: {
            type: Number,
            required: true,
        },
        square: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        house_number: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        }

    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Apartment', ApartmentSchema);
