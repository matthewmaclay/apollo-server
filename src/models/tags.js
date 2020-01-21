import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    count: {
        type: Number,
        required: true,
      },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
