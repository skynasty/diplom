import mongoose from 'mongoose';

const ApplocationSchema = new mongoose.Schema(
    {
        dateBegin: {
            type: Date,
            required: true,
        },
        dateEnd: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'В ожидании',
        },
        phone: {
            type: String,
            required: true,
            default: '',
        },
        cost: {
            type: Number,
            required: true,
            default: 0,

        },
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

export default mongoose.model('Application', ApplocationSchema);
