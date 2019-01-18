import { TopicSchema } from '../model/Topic.js';
import { UserSchema } from '../model/User.js';

export const attachModels = function attachModels (fn) {
  return async function ({db, event, context}) {
    const Topic = db.model( 'Topic', TopicSchema);
    const User = db.model( 'User', UserSchema);
    return await fn({db, event, context, Topic, User})
  }
}
