import mongoose from 'mongoose';

import User from './user';
import Bookmark from './bookmark';
import Tag from './tags';

const connectDb = () => {
  if (process.env.TEST_DATABASE_URL) {
    return mongoose.connect(
      process.env.TEST_DATABASE_URL,
      { useNewUrlParser: true },
    );
  }

  if (process.env.DATABASE_URL) {
    return mongoose.connect(
      process.env.DATABASE_URL,
      { useNewUrlParser: true },
    );
  }
};

const models = { User, Bookmark, Tag};

export { connectDb };

export default models;
