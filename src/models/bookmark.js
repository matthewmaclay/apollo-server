import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    week: {
      type: Array,
    },
    isReaded: Boolean,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tagsIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Tag' },
  },
  {
    timestamps: true,
  },
);

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
