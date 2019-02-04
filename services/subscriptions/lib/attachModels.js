import { TopicSchema } from '../model/Topic.js';
import { UserSchema } from '../model/User.js';
import { SubscriptionSchema } from '../model/Subscription'
import { NotificationSchema } from '../model/Notification'
import { getUser } from './getUser.js';

export const attachModels = function attachModels(fn) {
  return async function ({ db, event, context, callback }) {
    const Topic = db.model('Topic', TopicSchema);
    const User = db.model('User', UserSchema);
    const Subscription = db.model('Subscription', SubscriptionSchema);
    const Notification = db.model('Notification', NotificationSchema);
    return await fn({ db, event, context, callback, Topic, User, Subscription, Notification })
  }
}
