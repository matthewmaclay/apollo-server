import { PubSub } from 'apollo-server';

import * as BOOKMARK_EVENTS from './bookmark';

export const EVENTS = {
  BOOKMARK: BOOKMARK_EVENTS,
};

export default new PubSub();
